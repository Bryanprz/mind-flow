class UsersController < ApplicationController
  before_action :set_user, only: %i[show edit update destroy]
  before_action :load_quiz_results, only: [:show, :self]

  # GET /self - Shows the current user's profile or guest quiz results
  def show
    @symptoms = [
      {stage: 1, name: 'Accumulation', description: 'stuff', symptoms: ['Bloating', 'Mild fatigue']},
      {stage: 2, name: 'Aggravation', description: 'stuff', symptoms: ['Heartburn', 'Mild pain']},
      {stage: 3, name: 'Overflow', description: 'stuff', symptoms: ['Headache', 'Rash']},
      {stage: 4, name: 'Relocation', description: 'stuff', symptoms: ['Joint pain', 'Muscle ache']},
      {stage: 5, name: 'Manifestation', description: 'stuff', symptoms: ['Chronic pain', 'Digestive issues']},
      {stage: 6, name: 'Complication', description: 'stuff', symptoms: ['Arthritis', 'Ulcer']}
    ]

    respond_to do |format|
      format.html do
        if current_user
          @user = current_user
          render :show
        elsif session[:quiz_entry_id]
          @quiz_entry = QuizEntry.find_by(id: session[:quiz_entry_id])
          if @quiz_entry.nil?
            session.delete(:quiz_entry_id)
            redirect_to root_path, alert: "Session expired. Please take the quiz again."
            return
          end
          render :show
        else
          redirect_to root_path, notice: "Please take the quiz to see your results."
        end
      end
      
      format.turbo_stream do
        # This will render users/self.turbo_stream.erb
      end
    end
  end

  # GET /users or /users.json
  def index
    @users = User.all
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users or /users.json
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        format.html { redirect_to @user, notice: "User was successfully created." }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # POST /users/create_from_quiz
  def create_from_quiz
    @user = User.new(user_params)
    @quiz_entry = QuizEntry.find_by(id: params[:quiz_entry_id])

    if @user.save
      if @quiz_entry
        @quiz_entry.update(user: @user)
        session.delete(:quiz_entry_id) # Clear the guest session ID
      end
      # Placeholder for logging in the user. You'll need to implement this
      # based on your authentication system (e.g., `log_in @user` for custom auth,
      # or `sign_in @user` for Devise).
      # For now, we'll just redirect.
      redirect_to root_path, notice: "Account created and results saved!"
    else
      # If user creation fails, re-render the results page with errors
      # This requires passing @user and @quiz_entry to the partial
      respond_to do |format|
        format.html { render "quizzes/_results", locals: { quiz_entry: @quiz_entry, user: @user }, status: :unprocessable_entity }
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            "main_content_area",
            partial: "quizzes/results",
            locals: { quiz_entry: @quiz_entry, user: @user }
          )
        end
      end
    end
  end

  # PATCH/PUT /users/1 or /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to @user, notice: "User was successfully updated." }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1 or /users/1.json
  def destroy
    @user.destroy!

    respond_to do |format|
      format.html { redirect_to users_path, status: :see_other, notice: "User was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  def load_quiz_results
    if @user
      # For regular user show action
      @quiz_entry = @user.quiz_entries.completed.order(completed_at: :desc).first
    elsif session[:quiz_entry_id]
      # For guest users
      @quiz_entry = QuizEntry.find_by(id: session[:quiz_entry_id])
    end
    
    if @quiz_entry
      dosha_info = @quiz_entry.calculate_primary_doshas
      @primary_dosha_name = dosha_info[:primary_dosha]
      @secondary_dosha_name = dosha_info[:secondary_dosha]
      @primary_dosha = Dosha.find_by(name: @primary_dosha_name) if @primary_dosha_name
      @secondary_dosha = Dosha.find_by(name: @secondary_dosha_name) if @secondary_dosha_name
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id]) if params[:id].present?
  end

  # Only allow a list of trusted parameters through.
  def user_params
    params.require(:user).permit(:email, :first_name, :last_name, :password)
  end
end
