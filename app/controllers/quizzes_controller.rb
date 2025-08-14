class QuizzesController < ApplicationController
  before_action :authenticate_user!, except: [:start_prakruti_quiz, :answer_question, :go_back_question, :show_results]
  before_action :set_quiz_submission, only: [:answer_question, :go_back_question, :show_results]

  def start_prakruti_quiz
    @quiz = Quiz.find_by(category: :prakruti)  # Using symbol for enum
    raise ActiveRecord::RecordNotFound, "No 'Prakruti' quiz found." unless @quiz
    raise ActiveRecord::RecordNotFound, "The 'Prakruti' quiz has no questions." if @quiz.questions.empty?

    # Create a new submission for this quiz
    @quiz_submission = QuizSubmission.create!(
      user: current_user,  # Will be nil for guests
      quiz: @quiz
    )
    
    # Store the submission ID in the session
    session[:quiz_submission_id] = @quiz_submission.id
    @question = @quiz.questions.order(:id).first

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "main_content_area",
          partial: "quizzes/question",
          locals: { 
            question: @question, 
            quiz_submission: @quiz_submission, 
            has_previous_question: false 
          }
        )
      end
    end
  end

  def answer_question
    @question = Question.find(params[:question_id])
    @quiz_option = QuizOption.find(params[:quiz_option_id])

    # Create the answer associated with the submission
    @quiz_submission.quiz_answers.create!(
      quiz_option: @quiz_option
    )

    # Reload to ensure we have the latest data
    @quiz_submission.reload
    
    all_quiz_questions = @quiz_submission.quiz.questions.order(:id)
    current_question_index = all_quiz_questions.index(@question)
    @next_question = all_quiz_questions[current_question_index + 1] if current_question_index

    respond_to do |format|
      format.turbo_stream do
        if @next_question.present?
          render turbo_stream: turbo_stream.replace(
            "main_content_area",
            partial: "quizzes/question",
            locals: { 
              question: @next_question, 
              quiz_submission: @quiz_submission, 
              has_previous_question: true 
            }
          )
        else
          # Mark the submission as completed
          @quiz_submission.update!(
            completed_at: Time.current,
            results: calculate_results
          )

          # Store the results in the session
          session[:recent_quiz_results] = {
            dosha_scores: @quiz_submission.results[:scores],
            primary_dosha: @quiz_submission.results[:primary_dosha],
            completed_at: Time.current,
            show_results: true
          }

          render turbo_stream: turbo_stream.replace(
            'main_content_area',
            partial: 'quizzes/analyzing',
            locals: { quiz_submission: @quiz_submission }
          )
        end
      end
    end
  end

  def go_back_question
    last_answer = @quiz_submission.quiz_answers.order(created_at: :desc).first
    last_answer&.destroy

    all_quiz_questions = @quiz_submission.quiz.questions.order(:id)
    @question = if @quiz_submission.quiz_answers.empty?
                  all_quiz_questions.first
                else
                  @quiz_submission.quiz_answers.order(created_at: :desc).first.quiz_option.question
                end

    current_question_index = all_quiz_questions.index(@question)
    has_previous_question = current_question_index > 0

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "main_content_area",
          partial: "quizzes/question",
          locals: { 
            question: @question, 
            quiz_submission: @quiz_submission, 
            has_previous_question: has_previous_question 
          }
        )
      end
    end
  end

  def show_results
    # Calculate results if not already done
    if @quiz_submission.completed_at.nil?
      @quiz_submission.calculate_results
      @quiz_submission.reload
    end
    
    @primary_dosha = @quiz_submission.primary_dosha
    @secondary_dosha = @quiz_submission.secondary_dosha
    
    # Store results in session for the user profile
    session[:recent_quiz_results] = {
      primary_dosha: @primary_dosha&.name,
      secondary_dosha: @secondary_dosha&.name,
      dosha_scores: @quiz_submission.dosha_scores,
      completed_at: @quiz_submission.completed_at
    }

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "main_content_area",
          partial: "quizzes/results",
          locals: { 
            quiz_submission: @quiz_submission,
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

  def set_quiz_submission
    submission_id = params[:quiz_submission_id] || params[:id] || session[:quiz_submission_id]
    @quiz_submission = QuizSubmission.find_by(id: submission_id)
    
    # Allow access if:
    # 1. The submission exists AND
    # 2. Either the session matches OR the user owns the submission
    unless @quiz_submission && 
           (session[:quiz_submission_id].to_i == @quiz_submission.id || 
            (current_user && @quiz_submission.user_id == current_user.id) ||
            @quiz_submission.user_id.nil?)  # Allow if submission has no user (guest)
      redirect_to root_path, alert: "Quiz session expired or invalid. Please start again."
      return
    end
    
    # Update the session to the current submission ID
    session[:quiz_submission_id] = @quiz_submission.id
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
