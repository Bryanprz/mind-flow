class HealingPlansController < ApplicationController
  before_action :set_healing_plan, only: %i[ edit update destroy ]
  before_action :require_admin, only: [:index, :new]

  def index
    # Scope plans to the current user and order by version
    @healing_plans = Current.user.healing_plans.order(version: :desc)
  end

  def show
    unless Current.user.prakruti_plans.any?
      redirect_to prakruti_assessment_intro_path, alert: "You must take this assessment first before we can build your healing plan."
      return
    end

    # Prioritize showing Vikruti plans, fall back to Prakruti plans
    plan_set = Current.user.vikruti_plans.presence || Current.user.prakruti_plans
    @duration_type = params[:duration_type] || HealingPlan::DAILY

    # Find the specific plan for the selected duration
    @healing_plan = plan_set.find_by(duration_type: @duration_type)
  end

  def new
  end

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

  def create_daily_log
    healing_plan = HealingPlan.find(params[:healing_plan_id])
    daily_log = HealingPlanLog.for_today(healing_plan)

    if daily_log.persisted?
      render json: { healing_plan_log_id: daily_log.id }, status: :created
    else
      render json: { errors: daily_log.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    head :not_found # Send a 404 if healing_plan not found
  rescue => e
    Rails.logger.error "Error creating daily log: #{e.message}"
    head :internal_server_error # Send a 500 for other errors
  end

  def log_item_progress
    plan_item = PlanItem.find(params[:plan_item_id])
    healing_plan_log = HealingPlanLog.find(params[:healing_plan_log_id]) # Find the parent log

    if params[:completed]
      PlanItemLog.find_or_create_by(plan_item: plan_item, healing_plan_log: healing_plan_log) do |log|
        log.completed_at = Time.current
      end
    else
      PlanItemLog.where(plan_item: plan_item, healing_plan_log: healing_plan_log).destroy_all
    end
    head :ok
  rescue ActiveRecord::RecordNotFound
    head :not_found
  rescue => e
    Rails.logger.error "Error logging plan item progress: #{e.message}"
    head :internal_server_error
  end

  def save_plan_log
    healing_plan_log = HealingPlanLog.find(params[:healing_plan_log_id]) # Find the existing log
    healing_plan_log.update(
      journal_entry: params[:journal_entry],
      completed_at: Time.current # Mark as completed when saved
    )
    head :ok
  rescue ActiveRecord::RecordNotFound
    head :not_found
  rescue => e
    Rails.logger.error "Error saving healing plan log: #{e.message}"
    head :internal_server_error
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
