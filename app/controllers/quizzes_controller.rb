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
    @quiz_entry = QuizEntry.create!(quiz: @quiz)
    session[:quiz_entry_id] = @quiz_entry.id

    # Get the first question of the quiz
    @question = @quiz.questions.order(:id).first

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "main_content_area", # Target the turbo-frame on the dashboard page
          partial: "quizzes/question",
          locals: { question: @question, quiz_entry: @quiz_entry, has_previous_question: false }
        )
      end
    end
  end

  def answer_question
    @quiz_entry = QuizEntry.find_by(id: params[:quiz_entry_id])

    unless @quiz_entry && session[:quiz_entry_id] == @quiz_entry.id
      # If quiz_entry is not found or session doesn't match, redirect to start
      redirect_to root_path, alert: "Quiz session expired or invalid. Please start again." and return
    end

    @question = Question.find(params[:question_id])
    @quiz_option = QuizOption.find(params[:quiz_option_id])

    # Save the user's answer
    @quiz_answer = @quiz_entry.quiz_answers.create!(
      quiz_option: @quiz_option
    )

    # Determine the next question
    all_quiz_questions = @quiz_entry.quiz.questions.order(:id)
    current_question_index = all_quiz_questions.index(@question)
    @next_question = all_quiz_questions[current_question_index + 1]

    respond_to do |format|
      format.turbo_stream do
        if @next_question.present?
          # Render the next question
          render turbo_stream: turbo_stream.replace(
            "main_content_area", # Target the turbo-frame
            partial: "quizzes/question",
            locals: { question: @next_question, quiz_entry: @quiz_entry, has_previous_question: true }
          )
        else
          # Quiz is complete
          @quiz_entry.update(completed_at: Time.current)
          
          # For logged-in users, update their prakruti
          if current_user
            @quiz_entry.update(user: current_user)
            @quiz_entry.update_user_prakruti!
          else
            # For guests, store the quiz_entry_id in the session
            session[:quiz_entry_id] = @quiz_entry.id
          end
          
          # Redirect to self profile to show results
          redirect_to self_profile_path
        end
      end
    end
  end

  def go_back_question
    @quiz_entry = QuizEntry.find_by(id: params[:quiz_entry_id])

    unless @quiz_entry && session[:quiz_entry_id] == @quiz_entry.id
      redirect_to root_path, alert: "Quiz session expired or invalid. Please start again." and return
    end

    # Find the last answer for the current quiz entry and destroy it
    last_answer = @quiz_entry.quiz_answers.order(created_at: :desc).first
    last_answer.destroy if last_answer.present?

    # Determine the previous question
    all_quiz_questions = @quiz_entry.quiz.questions.order(:id)
    # If there are no answers, it means we are going back to the first question
    if @quiz_entry.quiz_answers.empty?
      @question = all_quiz_questions.first
      has_previous_question = false
    else
      # Otherwise, get the question from the last remaining answer
      previous_answer = @quiz_entry.quiz_answers.order(created_at: :desc).first
      @question = previous_answer.question
      current_question_index = all_quiz_questions.index(@question)
      has_previous_question = current_question_index > 0
    end

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

  def analyze
    @quiz_entry = QuizEntry.find_by(id: params[:quiz_entry_id])
    
    unless @quiz_entry && (session[:quiz_entry_id] == @quiz_entry.id || (current_user && current_user.quiz_entries.include?(@quiz_entry)))
      redirect_to root_path, alert: "Quiz session expired or invalid. Please start again." and return
    end
    
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "main_content_area",
          partial: "quizzes/analyzing",
          locals: { quiz_entry: @quiz_entry }
        )
      end
      format.html { render partial: "quizzes/analyzing", locals: { quiz_entry: @quiz_entry } }
    end
  end

  def show_results
    @quiz_entry = QuizEntry.find_by(id: params[:quiz_entry_id] || params[:id])

    # Allow access if:
    # 1. The quiz entry exists and matches the session (for guests)
    # 2. The current user owns the quiz entry (for logged-in users)
    # 3. The quiz entry is completed
    unless @quiz_entry && 
           (session[:quiz_entry_id] == @quiz_entry.id || 
            (current_user && current_user.quiz_entries.include?(@quiz_entry)))
      redirect_to root_path, alert: "Quiz session expired or invalid. Please start again." and return
    end

    # Calculate results using the QuizEntry model methods
    dosha_info = @quiz_entry.calculate_primary_doshas
    @primary_dosha_name = dosha_info[:primary_dosha]
    @secondary_dosha_name = dosha_info[:secondary_dosha]

    @primary_dosha = Dosha.find_by(name: @primary_dosha_name) if @primary_dosha_name
    @secondary_dosha = Dosha.find_by(name: @secondary_dosha_name) if @secondary_dosha_name

    # For logged-in users, update their prakruti if not set
    @quiz_entry.update_user_prakruti! if current_user

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
end
