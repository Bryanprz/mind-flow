class QuizzesController < ApplicationController
  before_action :set_quiz_entry, only: [:answer_question, :go_back_question, :show_results]

  def start_prakruti_quiz
    @quiz = Quiz.find_by(category: 'prakruti')
    raise ActiveRecord::RecordNotFound, "No 'Prakruti' quiz found." unless @quiz
    raise ActiveRecord::RecordNotFound, "The 'Prakruti' quiz has no questions." if @quiz.questions.empty?

    @quiz_entry = QuizEntry.create!(quiz: @quiz)
    session[:quiz_entry_id] = @quiz_entry.id

    @question = @quiz.questions.order(:id).first

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "main_content_area",
          partial: "quizzes/question",
          locals: { question: @question, quiz_entry: @quiz_entry, has_previous_question: false }
        )
      end
    end
  end

  def answer_question
    @question = Question.find(params[:question_id])
    @quiz_option = QuizOption.find(params[:quiz_option_id])

    @quiz_entry.quiz_answers.create!(quiz_option: @quiz_option)

    all_quiz_questions = @quiz_entry.quiz.questions.order(:id)
    current_question_index = all_quiz_questions.index(@question)
    @next_question = all_quiz_questions[current_question_index + 1]

    respond_to do |format|
      format.turbo_stream do
        if @next_question.present?
          render turbo_stream: turbo_stream.replace(
            "main_content_area",
            partial: "quizzes/question",
            locals: { question: @next_question, quiz_entry: @quiz_entry, has_previous_question: true }
          )
        else
          @quiz_entry.update(completed_at: Time.current)
          @quiz_entry.update(user: current_user) if current_user
          @quiz_entry.update_user_prakruti!

          render turbo_stream: turbo_stream.replace(
            'main_content_area',
            partial: 'quizzes/analyzing',
            locals: { quiz_entry: @quiz_entry }
          )
        end
      end
    end
  end

  def go_back_question
    last_answer = @quiz_entry.quiz_answers.order(created_at: :desc).first
    last_answer.destroy if last_answer.present?

    all_quiz_questions = @quiz_entry.quiz.questions.order(:id)
    @question = if @quiz_entry.quiz_answers.empty?
                  all_quiz_questions.first
                else
                  @quiz_entry.quiz_answers.order(created_at: :desc).first.question
                end

    current_question_index = all_quiz_questions.index(@question)
    has_previous_question = current_question_index > 0

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "main_content_area",
          partial: "quizzes/question",
          locals: { question: @question, quiz_entry: @quiz_entry, has_previous_question: has_previous_question }
        )
      end
    end
  end

  def show_results
    dosha_info = @quiz_entry.calculate_primary_doshas
    @primary_dosha = Dosha.find_by(name: dosha_info[:primary_dosha])
    @secondary_dosha = Dosha.find_by(name: dosha_info[:secondary_dosha])

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "main_content_area",
          partial: "quizzes/results",
          locals: { 
            quiz_entry: @quiz_entry, 
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

  def set_quiz_entry
    @quiz_entry = QuizEntry.find_by(id: params[:quiz_entry_id] || params[:id] || session[:quiz_entry_id])
    unless @quiz_entry && (session[:quiz_entry_id] == @quiz_entry.id || (current_user && @quiz_entry.user == current_user))
      redirect_to root_path, alert: "Quiz session expired or invalid. Please start again."
    end
  end
end
