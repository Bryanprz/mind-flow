class HealingPlansController < ApplicationController
  before_action :set_healing_plan, only: %i[ edit update destroy ]
  before_action :require_admin, only: [:index, :new]
  # TODO: Add a before_action to ensure a user is logged in, e.g.:
  # before_action :authenticate_user!

  # GET /healing_plans
  def index
    # Scope plans to the current user and order by version
    @healing_plans = Current.user.healing_plans.order(version: :desc)
  end

  # GET /healing_plan
  def show
    unless Current.user.prakruti_plan
      redirect_to prakruti_assessment_intro_path, alert: "You must take this assessment first before we can build your healing plan."
      return
    end

    @healing_plans = Current.user.healing_plans.order(version: :desc)
    @prakruti_plan = Current.user.prakruti_plan
    @plan_sections = @prakruti_plan&.plan_sections || []
    
    @plan_type = params[:plan_type] || 'daily'
  end

  # GET /healing_plans/new
  def new
  end

  # POST /healing_plans
  def create
    # Find the user's Prakruti Dosha
    prakruti_dosha = Current.user.prakruti

    if prakruti_dosha.nil?
      redirect_to new_healing_plan_path, alert: "Please complete your Prakruti Assessment first to generate a personalized plan."
      return
    end

    # Find the HealingPlanTemplate associated with the user's Prakruti Dosha
    healing_plan_template = HealingPlanTemplate.find_by(dosha: prakruti_dosha)

    if healing_plan_template.nil?
      redirect_to new_healing_plan_path, alert: "No healing plan template found for your Prakruti Dosha (#{prakruti_dosha.name})."
      return
    end

    # Use the service to generate the new plan.
    @healing_plan = CreateHealingPlan.new(Current.user, healing_plan_template).call

    if @healing_plan.persisted?
      redirect_to @healing_plan, notice: "Your new Healing Plan has been generated."
    else
      # If the service failed for some reason, render the new template again.
      render :new, status: :unprocessable_entity
    end
  end

  # GET /healing_plans/1/edit
  def edit
  end

  # PATCH/PUT /healing_plans/1
  def update
    if @healing_plan.update(healing_plan_params)
      redirect_to @healing_plan, notice: "Healing plan was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /healing_plans/1
  def destroy
    @healing_plan.destroy!
    redirect_to healing_plans_path, notice: "Healing plan was successfully destroyed."
  end

  private

  def require_admin
    unless Current.user&.admin?
      redirect_to root_path, alert: "You are not authorized to access this page."
    end
  end

  def set_healing_plan
    # Scope the find to the current user's plans for security.
    @healing_plan = Current.user.healing_plans.find(params[:id])
  end

  def healing_plan_params
    # These params are used for the update action.
    params.require(:healing_plan).permit(:name, :description)
  end
end
