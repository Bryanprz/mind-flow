class UsersController < ApplicationController
  skip_before_action :require_authentication, only: %i[new create]
  before_action :set_user, only: %i[show edit update destroy]
  before_action :set_assessment_entry, only: [:create]

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /self - Shows the current user's profile or guest quiz results
  def show
    # user should only be allowed to go to show action if they are logged in 
    # in that case the assessment entry should be grabbed from teh db since its 
    # already been registered to them, and the session assessment_entry_id should
    # be ignored

    @symptoms = []

    DiseaseStage.all.each do |disease_stage|
      @symptoms << { 
        stage: disease_stage.formation_stage,
        name: disease_stage.name,
        description: disease_stage.description,
        symptoms: ['']
      }
    end

    # Set primary and secondary dosha from user's prakruti/vikruti if available
    if @user
      @primary_dosha = @user.prakruti
      
    end

    # Retrieve assessment entry for detailed results and percentages
    if @user && @user.assessment_entries.any?
      @assessment_entry = @user.assessment_entries.order(created_at: :desc).first
    end

    # Calculate percentages only if assessment_entry is present
    if @assessment_entry
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

  # GET /users/1/edit
  def edit
  end

  # POST /users or /users.json
  def create
    @user = User.new(user_params)
    @user.prakruti = @assessment_entry.primary_dosha if @assessment_entry
    @primary_dosha = @user.prakruti

    respond_to do |format|
      if @user.save
        start_new_session_for(@user) # Log in the user using the Authentication concern
        @assessment_entry&.update(user: @user) # Associate assessment with user
        CreateHealingPlan.new(@user, @assessment_entry.health_assessment).call if @assessment_entry # Create healing plan
        session.delete(:assessment_entry_id) # Clear session

        if params[:receive_health_report] == "1"
          # Logic to send health report, e.g., send an email
          # UserMailer.health_report(@user).deliver_now
        end

        format.html { redirect_to dashboard_path, notice: "Account created successfully!" }
        format.json { render :show, status: :created, location: dashboard_path }
      else
        format.html { render :new, status: :unprocessable_entity } # Fallback for non-Turbo requests
        format.turbo_stream { render turbo_stream: turbo_stream.replace("main_content_area", partial: "shared/sign_up_modal_form", locals: { user: @user }), status: :unprocessable_entity }
        format.json { render json: @user.errors, status: :unprocessable_entity }
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
      format.html { redirect_to users_path, status: :see_other, notice: "User was successfully deleted." }
      format.json { head :no_content }
    end
  end

  private

  def set_user
    if Current.user # If a user is logged in via Current.user
      @user = Current.user
    elsif params[:id].present? # Otherwise, try to find by ID from params
      @user = User.find(params[:id])
    end
  end

  def set_assessment_entry
    if session[:assessment_entry_id].present?
      @assessment_entry = AssessmentEntry.find_by(id: session[:assessment_entry_id])
    end
  end

  def user_params
    params.require(:user).permit(:name, :email_address, :password)
  end
end
