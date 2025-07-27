class QuizzesController < ApplicationController
  def start_prakruti_quiz
    # Find the Prakruti quiz by its category
    @quiz = Quiz.find_by(category: 'prakruti')

    if @quiz.nil?
      raise ActiveRecord::RecordNotFound, "No 'Prakruti' quiz found to start. Please ensure it's created and has category set to :prakruti."
    end

    if @quiz.questions.empty?
      raise ActiveRecord::RecordNotFound, "The 'Prakruti' quiz has no questions. Please add questions to the quiz before starting."
    end

    # Create a new quiz submission for the current user
    # Assuming `current_user` is available (you'll need to implement authentication if not)
    # For now, let's assume a dummy user if current_user is not available for testing
    @quiz_submission = QuizSubmission.create!(quiz: @quiz)
    session[:quiz_submission_id] = @quiz_submission.id

    # Get the first question of the quiz
    @question = @quiz.questions.order(:id).first

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "main_content_area", # Target the turbo-frame on the dashboard page
          partial: "quizzes/question",
          locals: { question: @question, quiz_submission: @quiz_submission }
        )
      end
    end
  end

  def answer_question
    @quiz_submission = QuizSubmission.find_by(id: params[:quiz_submission_id])

    unless @quiz_submission && session[:quiz_submission_id] == @quiz_submission.id
      # If quiz_submission is not found or session doesn't match, redirect to start
      redirect_to root_path, alert: "Quiz session expired or invalid. Please start again." and return
    end

    @question = Question.find(params[:question_id])
    @quiz_option = QuizOption.find(params[:quiz_option_id])

    # Save the user's answer
    @quiz_answer = @quiz_submission.quiz_answers.create!(
      question: @question,
      quiz_option: @quiz_option
    )

    # Determine the next question
    all_quiz_questions = @quiz_submission.quiz.questions.order(:id)
    current_question_index = all_quiz_questions.index(@question)
    @next_question = all_quiz_questions[current_question_index + 1]

    respond_to do |format|
      format.turbo_stream do
        if @next_question.present?
          # Render the next question
          render turbo_stream: turbo_stream.replace(
            "main_content_area", # Target the turbo-frame
            partial: "quizzes/question",
            locals: { question: @next_question, quiz_submission: @quiz_submission }
          )
        else
          # Quiz is complete, render results
          @quiz_submission.update(completed_at: Time.current)
          render turbo_stream: turbo_stream.replace(
            "main_content_area", # Target the turbo-frame
            partial: "quizzes/results",
            locals: { quiz_submission: @quiz_submission }
          )
        end
      end
    end
  end
end
