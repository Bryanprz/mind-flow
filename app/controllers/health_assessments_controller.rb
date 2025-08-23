class HealthAssessmentsController < ApplicationController
  allow_unauthenticated_access
  before_action :ensure_current_session_is_resumed, only: %i[start_prakruti_assessment start_vikruti_assessment start_chronic_issues_assessment submit_answers show_results]
  before_action :set_assessment_entry, only: [:submit_answers, :show_results]

  def ensure_current_session_is_resumed
    resume_session
  end

  def start_prakruti_assessment
    start_assessment(:prakruti)
  end

  def start_vikruti_assessment
    start_assessment(:vikruti)
  end

  def start_chronic_issues_assessment
    start_assessment(:chronic_issues)
  end

  def start_assessment(assessment_type)
    @health_assessment = HealthAssessment.find_by(category: assessment_type)

    # Create a new submission for this assessment
    @assessment_entry = AssessmentEntry.create!(
      user: Current.user,  # Will be nil for guests
      health_assessment: @health_assessment
    )

    # Store the submission ID in the session
    session[:assessment_entry_id] = @assessment_entry.id

    # Eager load all questions and their options to avoid N+1 queries
    @questions = @health_assessment.assessment_questions.includes(:assessment_options).order(:id)

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "main_content_area",
          partial: "health_assessments/question",
          locals: { 
            questions: @questions,
            assessment_entry: @assessment_entry
          }
        )
      end
      format.json do
        render json: {
          questions: @questions.as_json(include: :assessment_options)
        }
      end
      format.html
    end
  end

  def submit_answers
    # Parse the JSON string if it's a string, otherwise use as is
    answers_param = params.require(:answers)
    answers = if answers_param.is_a?(String)
                JSON.parse(answers_param, symbolize_names: true)
              else
                answers_param.map { |a| a.permit(:question_id, :option_id).to_h.symbolize_keys }
              end

    # Prepare all answers for a single bulk insert
    answers_to_insert = answers.map do |answer|
      {
        assessment_entry_id: @assessment_entry.id,
        assessment_option_id: answer[:option_id],
        created_at: Time.current,
        updated_at: Time.current
      }
    end
    AssessmentAnswer.insert_all(answers_to_insert) if answers_to_insert.any?

    # Mark the entry as completed
    @assessment_entry.update!(completed_at: Time.current)
    @assessment_entry.reload

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.replace('main_content_area', 
            partial: 'health_assessments/analyzing',
            locals: { 
              assessment_entry: @assessment_entry,
              assessment_type: @assessment_entry.health_assessment.category
            }
          ),
        ]
      end
      format.html { redirect_to assessment_results_path(@assessment_entry.id) }
    end
  end

  def show_results
    # Find the assessment entry by ID from params
    @assessment_entry = AssessmentEntry.find(params[:entry_id])
    
    render "health_assessments/results", locals: {
      assessment_entry: @assessment_entry,
      primary_dosha: @assessment_entry.primary_dosha, 
      secondary_dosha: @assessment_entry.secondary_dosha,
      current_user: current_user
    }
  end

  private

  def set_assessment_entry
    @assessment_entry = AssessmentEntry.find_by(id: session[:assessment_entry_id])

    unless @assessment_entry
      redirect_to root_path, 
        alert: "Assessment session expired or invalid. Please start again."
      return
    end
  end
end
