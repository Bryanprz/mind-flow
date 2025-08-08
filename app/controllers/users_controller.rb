class UsersController < ApplicationController
  before_action :set_user, only: %i[show edit update destroy]
  before_action :load_quiz_results, only: [:show]

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
    # This simplified method handles only the case where recent quiz results
    # are present in the session, for a non-logged-in user.
    if session[:recent_quiz_results].present?
      # Use .with_indifferent_access because session stores hash keys as strings.
      # session.delete ensures the results are only shown once.
      @recent_quiz_results = session.delete(:recent_quiz_results).with_indifferent_access

      # Set the instance variables required by the view.
      @primary_dosha_name = @recent_quiz_results[:primary_dosha]
      @dosha_scores = @recent_quiz_results[:dosha_scores]
      @primary_dosha = Dosha.find_by(name: @primary_dosha_name.downcase)

      # The completed_at from session is a string, so it needs to be parsed.
      if @recent_quiz_results[:completed_at].is_a?(String)
        @recent_quiz_results[:completed_at] = Time.parse(@recent_quiz_results[:completed_at])
      end

      # Calculate secondary dosha from scores.
      if @dosha_scores.present?
        sorted_scores = @dosha_scores.sort_by { |_, v| -v }
        if sorted_scores.length > 1
          @secondary_dosha_name = sorted_scores[1].first
          @secondary_dosha = Dosha.find_by(name: @secondary_dosha_name.downcase)
        end
      end
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
