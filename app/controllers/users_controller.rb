class UsersController < ApplicationController
  skip_before_action :require_authentication, only: %i[new create]
  before_action :set_user, only: %i[show edit update destroy]
  before_action :load_assessment_results, only: [:show]

  # GET /self - Shows the current user's profile or guest quiz results
  def show
    @symptoms = []

    DiseaseStage.all.each do |disease_stage|
      @symptoms << { 
        stage: disease_stage.formation_stage,
        name: disease_stage.name,
        description: disease_stage.description,
        symptoms: ['']
      }
    end
    
    # Ensure we have the most recent quiz submission for the user
    @assessment_entry = nil # Initialize to nil

    if params[:assessment_entry_id].present?
      # Prioritize the specific assessment_submission passed in the URL
      @assessment_entry = AssessmentEntry.find_by(id: params[:assessment_entry_id])
    # elsif current_user
    #   # Fallback for logged-in users: get their most recent completed submission
    #   @assessment_submission = current_user.assessment_submissions.completed.order(completed_at: :desc).first
    end

    if @assessment_entry
      @primary_dosha_name = @assessment_entry.primary_dosha&.name
      @secondary_dosha_name = @assessment_entry.secondary_dosha&.name
      
      # Calculate percentages
      total = @assessment_entry.results.values.sum.to_f
      @dosha_percentages = {}
      @assessment_entry.results.each do |dosha, score|
        @dosha_percentages[dosha.to_s.capitalize] = total > 0 ? ((score / total) * 100).round : 0
      end
    end

    respond_to do |format|
      format.html
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
    @quiz_submission = QuizSubmission.find_by(id: params[:quiz_submission_id])

    if @user.save
      if @quiz_submission
        @quiz_submission.update(user: @user)
        session.delete(:quiz_submission_id) # Clear the guest session ID
      end
      # Placeholder for logging in the user. You'll need to implement this
      # based on your authentication system (e.g., `log_in @user` for custom auth,
      # or `sign_in @user` for Devise).
      # For now, we'll just redirect.
      redirect_to root_path, notice: "Account created and results saved!"
    else
      # If user creation fails, re-render the results page with errors
      # This requires passing @user and @quiz_submission to the partial
      respond_to do |format|
        format.html { render "quizzes/_results", locals: { quiz_submission: @quiz_submission, user: @user }, status: :unprocessable_entity }
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            "main_content_area",
            partial: "quizzes/results",
            locals: { quiz_submission: @quiz_submission, user: @user }
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

  def load_assessment_results
    if session[:assessment_entry_id].present?
      @assessment_entry = AssessmentEntry.find_by(id: session[:assessment_entry_id])
      session.delete(:assessment_entry_id) # Clear the session after loading
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
