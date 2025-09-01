class HealthAssessmentsController < ApplicationController
  before_action :set_health_assessment, only: [:submit_answers]
  before_action :set_assessment_entry, only: [:show_results, :current_imbalance_results]
  allow_unauthenticated_access only: [:start_prakruti_assessment, :submit_answers, :show_results]

  def ensure_current_session_is_resumed
    resume_session
  end

  def start_prakruti_assessment
    start_assessment(:prakruti)
  end

  def start_vikruti_assessment
    start_assessment(:vikruti)
  end

  def start_assessment(assessment_type)
    @health_assessment = HealthAssessment.find_by(assessment_type: assessment_type)

    # Eager load all questions and their options to avoid N+1 queries
    @questions = @health_assessment.assessment_questions.includes(:assessment_options).order(:id)

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "main_content_area",
          partial: "health_assessments/question",
          locals: { 
            questions: @questions
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

  # Change how this action executes 
  # the logic here is creating too many healing plans with is_active
  # move this logic to service obje and update the is-active
  # 
  def submit_answers
    # Parse the JSON string if it's a string, otherwise use as is
    answers_param = params.require(:answers)
    answers = if answers_param.is_a?(String)
                JSON.parse(answers_param, symbolize_names: true)
              else
                answers_param.map { |a| a.permit(:question_id, :option_id).to_h.symbolize_keys }
              end

    @assessment_entry = CreateHealthAssessmentEntry.call(
      health_assessment: @health_assessment,
      answers: answers
    )
    # Determine and apply the appropriate healing protocol based on the assessment type
    if Current.user
      CreateHealingPlan.new(Current.user, @health_assessment).determine_and_apply_protocol
    end

    # Store the entry ID in the session for the results page to find.
    session[:assessment_entry_id] = @assessment_entry.id

    respond_to do |format|
      format.turbo_stream do
        redirect_path = if @assessment_entry.is_a?(VikrutiEntry)
                          current_imbalance_results_path
                        else
                          assessment_results_path
                        end
        render turbo_stream: turbo_stream.replace('main_content_area',
          partial: 'health_assessments/analyzing',
          locals: { redirect_path: redirect_path }
        )
      end
      format.html do
        if @assessment_entry.is_a?(VikrutiEntry)
          redirect_to current_imbalance_results_path
        else
          redirect_to assessment_results_path
        end
      end
    end
  end

  def show_results
    # @assessment_entry is loaded by the set_assessment_entry before_action
    render "health_assessments/results", locals: {
      assessment_entry: @assessment_entry,
      primary_dosha: @assessment_entry.primary_dosha, 
      current_user: current_user
    }

    # Clean up session data after results have been shown
    session.delete(:assessment_entry_id)
  end

  def current_imbalance_results
    # @assessment_entry is loaded by the set_assessment_entry before_action
    # Ensure it's a VikrutiEntry
    unless @assessment_entry.is_a?(VikrutiEntry)
      redirect_to root_path, alert: "Invalid assessment type for this page."
      return
    end

    render "health_assessments/current_imbalance_results", locals: {
      assessment_entry: @assessment_entry,
      primary_dosha: @assessment_entry.primary_dosha, 
      current_user: current_user
    }

    # Clean up session data after results have been shown
    session.delete(:assessment_entry_id)
  end

  private

  def set_health_assessment
    @health_assessment = HealthAssessment.find(params[:health_assessment_id])
  end

  def set_assessment_entry
    @assessment_entry = AssessmentEntry.find_by(id: session[:assessment_entry_id])

    unless @assessment_entry
      redirect_to root_path,
        alert: "Assessment results not found or your session has expired. Please try again."
      return
    end
  end
end
