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
          locals: { question: @question, quiz_submission: @quiz_submission, has_previous_question: false }
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
            locals: { question: @next_question, quiz_submission: @quiz_submission, has_previous_question: true }
          )
        else
          # Quiz is complete, redirect to user show page with quiz results
          @quiz_submission.update(completed_at: Time.current)
          redirect_to user_path(current_user || 'guest_profile', quiz_submission_id: @quiz_submission.id), notice: "Quiz completed! Here are your results."
        end
      end
    end
  end

  def go_back_question
    @quiz_submission = QuizSubmission.find_by(id: params[:quiz_submission_id])

    unless @quiz_submission && session[:quiz_submission_id] == @quiz_submission.id
      redirect_to root_path, alert: "Quiz session expired or invalid. Please start again." and return
    end

    # Find the last answer for the current quiz submission and destroy it
    last_answer = @quiz_submission.quiz_answers.order(created_at: :desc).first
    last_answer.destroy if last_answer.present?

    # Determine the previous question
    all_quiz_questions = @quiz_submission.quiz.questions.order(:id)
    # If there are no answers, it means we are going back to the first question
    if @quiz_submission.quiz_answers.empty?
      @question = all_quiz_questions.first
      has_previous_question = false
    else
      # Otherwise, get the question from the last remaining answer
      previous_answer = @quiz_submission.quiz_answers.order(created_at: :desc).first
      @question = previous_answer.question
      current_question_index = all_quiz_questions.index(@question)
      has_previous_question = current_question_index > 0
    end

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "main_content_area",
          partial: "quizzes/question",
          locals: { question: @question, quiz_submission: @quiz_submission, has_previous_question: has_previous_question }
        )
      end
    end
  end

  def show_results
    @quiz_submission = QuizSubmission.find_by(id: params[:quiz_submission_id])

    unless @quiz_submission && session[:quiz_submission_id] == @quiz_submission.id
      redirect_to root_path, alert: "Quiz session expired or invalid. Please start again." and return
    end

    # Calculate results
    dosha_scores = Hash.new(0)
    @quiz_submission.quiz_answers.each do |answer|
      dosha_scores[answer.quiz_option.dosha] += answer.quiz_option.points
    end

    # Sort doshas by score in descending order
    sorted_doshas = dosha_scores.sort_by { |_dosha, score| score }.reverse

    @primary_dosha_name = sorted_doshas[0][0] if sorted_doshas[0].present?
    @secondary_dosha_name = sorted_doshas[1][0] if sorted_doshas[1].present?

    @primary_dosha = Dosha.find_by(name: @primary_dosha_name)
    @secondary_dosha = Dosha.find_by(name: @secondary_dosha_name)

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "main_content_area",
          partial: "quizzes/results",
          locals: { quiz_submission: @quiz_submission, primary_dosha: @primary_dosha, secondary_dosha: @secondary_dosha }
        )
      end
    end
  end
end
