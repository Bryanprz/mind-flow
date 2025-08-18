class HealthAssessmentsController < ApplicationController
  before_action :authenticate_user!, except: [:start_prakruti_assessment, :answer_question, :go_back_question, :show_results]
  before_action :set_assessment_submission, only: [:answer_question, :go_back_question, :show_results]

  def start_prakruti_assessment
    @health_assessment = HealthAssessment.find_by(category: :prakruti)  # Using symbol for enum
    raise ActiveRecord::RecordNotFound, "No 'Prakruti' assessment found." unless @health_assessment
    raise ActiveRecord::RecordNotFound, "The 'Prakruti' assessment has no questions." if @health_assessment.assessment_questions.empty?

    # Create a new submission for this assessment
    @assessment_submission = AssessmentSubmission.create!(
      user: current_user,  # Will be nil for guests
      health_assessment: @health_assessment
    )
    
    # Store the submission ID in the session
    session[:assessment_submission_id] = @assessment_submission.id
    @assessment_question = @health_assessment.assessment_questions.order(:id).first

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "main_content_area",
          partial: "health_assessments/question",
          locals: { 
            question: @assessment_question, 
            assessment_submission: @assessment_submission, 
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

    # Create the answer associated with the submission
    @assessment_submission.assessment_answers.create!(
      assessment_option: @assessment_option
    )

    # Reload to ensure we have the latest data
    @assessment_submission.reload
    
    all_assessment_questions = @assessment_submission.health_assessment.assessment_questions.order(:id)
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
              assessment_submission: @assessment_submission, 
              has_previous_question: true 
            }
          )
        else
          # Mark the submission as completed
          @assessment_submission.update!(
            completed_at: Time.current,
            results: calculate_results
          )

          # Store the results in the session
          session[:recent_assessment_results] = {
            dosha_scores: @assessment_submission.results[:scores],
            primary_dosha: @assessment_submission.results[:primary_dosha],
            completed_at: Time.current,
            show_results: true
          }

          render turbo_stream: turbo_stream.replace(
            'main_content_area',
            partial: 'health_assessments/analyzing',
            locals: { assessment_submission: @assessment_submission }
          )
        end
      end
    end
  end

  def go_back_question
    last_answer = @assessment_submission.assessment_answers.order(created_at: :desc).first
    last_answer&.destroy

    all_assessment_questions = @assessment_submission.health_assessment.assessment_questions.order(:id)
    @assessment_question = if @assessment_submission.assessment_answers.empty?
                  all_assessment_questions.first
                else
                  @assessment_submission.assessment_answers.order(created_at: :desc).first.assessment_option.assessment_question
                end

    current_question_index = all_assessment_questions.index(@assessment_question)
    has_previous_question = current_question_index > 0

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "main_content_area",
          partial: "health_assessments/question",
          locals: { 
            question: @assessment_question, 
            assessment_submission: @assessment_submission, 
            has_previous_question: has_previous_question 
          }
        )
      end
    end
  end

  def show_results
    # Calculate results if not already done
    if @assessment_submission.completed_at.nil?
      @assessment_submission.calculate_results
      @assessment_submission.reload
    end
    
    @primary_dosha = @assessment_submission.primary_dosha
    @secondary_dosha = @assessment_submission.secondary_dosha
    
    # Store results in session for the user profile
    session[:recent_assessment_results] = {
      primary_dosha: @primary_dosha&.name,
      secondary_dosha: @secondary_dosha&.name,
      dosha_scores: @assessment_submission.dosha_scores,
      completed_at: @assessment_submission.completed_at
    }

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "main_content_area",
          partial: "health_assessments/results",
          locals: { 
            assessment_submission: @assessment_submission,
            primary_dosha: @primary_dosha, 
            secondary_dosha: @secondary_dosha,
            current_user: current_user
          }
        )
      end
      format.html
    end
  end

  private

  def set_assessment_submission
    submission_id = params[:assessment_submission_id] || params[:id] || session[:assessment_submission_id]
    @assessment_submission = AssessmentSubmission.find_by(id: submission_id)
    
    # Allow access if:
    # 1. The submission exists AND
    # 2. Either the session matches OR the user owns the submission
    unless @assessment_submission && 
           (session[:assessment_submission_id].to_i == @assessment_submission.id || 
            (current_user && @assessment_submission.user_id == current_user.id) ||
            @assessment_submission.user_id.nil?)  # Allow if submission has no user (guest)
      redirect_to root_path, alert: "Assessment session expired or invalid. Please start again."
      return
    end
    
    # Update the session to the current submission ID
    session[:assessment_submission_id] = @assessment_submission.id
  end

  def calculate_results
    # Implement your dosha calculation logic here
    # This is a placeholder - replace with your actual calculation
    {
      scores: { vata: 0, pitta: 0, kapha: 0 },  # Calculate these
      primary_dosha: 'vata',  # Calculate this
      secondary_dosha: 'pitta'  # Calculate this
    }
  end
end
