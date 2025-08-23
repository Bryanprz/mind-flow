class HealthAssessmentsController < ApplicationController
  allow_unauthenticated_access
  before_action :set_assessment_entry, only: [:answer_question, :go_back_question, :show_results]

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
    raise ActiveRecord::RecordNotFound, "No '#{assessment_type.to_s.humanize}' assessment found." unless @health_assessment
    raise ActiveRecord::RecordNotFound, "The '#{assessment_type.to_s.humanize}' assessment has no questions." if @health_assessment.assessment_questions.empty?

    # Create a new submission for this assessment
    @assessment_entry = AssessmentEntry.create!(
      user: current_user,  # Will be nil for guests
      health_assessment: @health_assessment
    )

    # Store the submission ID in the session
    session[:assessment_entry_id] = @assessment_entry.id
    @assessment_question = @health_assessment.assessment_questions.order(:id).first

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "main_content_area",
          partial: "health_assessments/question",
          locals: { 
            question: @assessment_question, 
            assessment_entry: @assessment_entry, 
            has_previous_question: false 
          }
        )
      end
      format.html
    end
  end

  def answer_question
    @assessment_question = AssessmentQuestion.find(params[:question_id])
    @assessment_option = AssessmentOption.find(params[:assessment_option_id])
  
    # Find or initialize the answer for this question
    answer = @assessment_entry.assessment_answers
      .joins(:assessment_option)
      .find_by(assessment_options: { assessment_question_id: @assessment_question.id })
  
    if answer
      # Update existing answer
      answer.update!(assessment_option: @assessment_option)
    else
      # Create new answer
      @assessment_entry.assessment_answers.create!(
        assessment_option: @assessment_option
      )
    end
  
    all_assessment_questions = @assessment_entry.questions.order(:id)
    current_question_index = all_assessment_questions.index(@assessment_question)
    @next_assessment_question = all_assessment_questions[current_question_index + 1] if current_question_index
  
    respond_to do |format|
      format.turbo_stream do
        if @next_assessment_question.present?
          render turbo_stream: turbo_stream.replace(
            "main_content_area",
            partial: "health_assessments/question",
            locals: { 
              question: @next_assessment_question, 
              assessment_entry: @assessment_entry, 
              has_previous_question: true 
            }
          )
        else
          # Mark the entry as completed
          binding.pry
          @assessment_entry.update!(
            user: Current.user,
            completed_at: Time.current
          )
          @assessment_entry.reload
  
          render turbo_stream: turbo_stream.replace(
            'main_content_area',
            partial: 'health_assessments/analyzing',
            locals: { 
              assessment_entry: @assessment_entry,
              assessment_type: @assessment_entry.health_assessment.category
            }
          )
        end
      end
    end
  end

  def go_back_question
    all_questions = @assessment_entry.questions.order(:id)
    current_question = AssessmentQuestion.find_by(id: params[:question_id])
    current_index = current_question ? all_questions.find_index(current_question) : 0
    
    @assessment_question = current_index.positive? ? all_questions[current_index - 1] : all_questions.first
  
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "main_content_area",
          partial: "health_assessments/question",
          locals: { 
            question: @assessment_question, 
            assessment_entry: @assessment_entry, 
            has_previous_question: current_index > 1
          }
        )
      end
    end
  end

  def show_results
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
