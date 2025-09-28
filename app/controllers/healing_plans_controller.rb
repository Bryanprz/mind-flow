class HealingPlansController < ApplicationController
  before_action :set_healing_plan, only: %i[ edit update destroy ]
  before_action :require_admin, only: [:new]

  def index
    # Scope plans to the current user and order by version
    @healing_plans = Current.user.healing_plans.order(version: :desc)
  end

  def show
    unless Current.user.prakruti_plans.any?
      redirect_to prakruti_assessment_intro_path, alert: "You must take this assessment first before we can build your healing plan."
      return
    end

    # Check if user has any healing plans at all
    unless Current.user.healing_plans.any?
      redirect_to prakruti_assessment_intro_path, alert: "No healing plans found. Please complete your assessment to generate healing plans."
      return
    end

    # Prioritize showing Vikruti plans, fall back to Prakruti plans
    plan_set = Current.user.vikruti_plans.presence || Current.user.prakruti_plans
    @duration_type = params[:duration_type] || 'daily'

    # Debug logging
    Rails.logger.info "🔍 Looking for healing plan with duration_type: #{@duration_type}"
    Rails.logger.info "🔍 Available plans: #{plan_set.pluck(:duration_type, :id)}"
    Rails.logger.info "🔍 Plan set count: #{plan_set.count}"
    Rails.logger.info "🔍 All user healing plans: #{Current.user.healing_plans.pluck(:duration_type, :id)}"
    Rails.logger.info "🔍 Raw duration_type values: #{plan_set.pluck(:duration_type)}"
    Rails.logger.info "🔍 Enum mapping: daily=#{HealingPlan.duration_types['daily']}, three_month=#{HealingPlan.duration_types['three_month']}, six_month=#{HealingPlan.duration_types['six_month']}"
    
    # Find the specific plan for the selected duration
    @healing_plan = plan_set.find_by(duration_type: @duration_type)

    if @healing_plan.nil?
      # If no plan found for this duration type, show a message instead of redirecting
      Rails.logger.info "🔍 No #{@duration_type} plan found"
      @healing_plan = nil
      @duration_type = params[:duration_type] || 'daily'
      @date = params[:date] ? Time.zone.parse(params[:date]).to_date : Time.zone.today
      @healing_plan_log = nil
      return
    end

    @date = params[:date] ? Time.zone.parse(params[:date]).to_date : Time.zone.today
    # Find existing log or create one if it doesn't exist (needed for journal editing)
    @healing_plan_log = @healing_plan.healing_plan_logs.find_by(date: @date) || 
                       @healing_plan.healing_plan_logs.create!(date: @date)
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
    date = params[:date] ? Date.parse(params[:date]) : Date.current
    daily_log = HealingPlanLog.for_date(healing_plan, date)

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
    healing_plan_log = HealingPlanLog.find(params[:healing_plan_log_id])

    if params[:completed]
      # Find or create the log, and update completed_at
      log = PlanItemLog.find_or_initialize_by(
        plan_item: plan_item, 
        healing_plan_log: healing_plan_log
      )
      log.completed_at = Time.current
      log.save!
    else
      PlanItemLog.where(
        plan_item: plan_item,
        healing_plan_log: healing_plan_log
      ).destroy_all
    end
    head :ok
  rescue ActiveRecord::RecordNotFound
    head :not_found
  rescue => e
    Rails.logger.error "Error logging plan item progress: #{e.message}"
    head :internal_server_error
  end

  def save_journal_log
    healing_plan_log = HealingPlanLog.find(params[:healing_plan_log_id]) # Find the existing log
    
    if healing_plan_log.update(
      journal_entry: params[:journal_entry],
      completed_at: Time.current # Mark as completed when saved
    )
      render json: { 
        status: 'success', 
        message: 'Journal entry saved successfully',
        journal_entry: params[:journal_entry]
      }
    else
      render json: { 
        status: 'error', 
        errors: healing_plan_log.errors.full_messages,
        message: 'Failed to save journal entry'
      }, status: :unprocessable_entity
    end
    
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "HealingPlanLog not found: #{e.message}"
    render json: { 
      status: 'error',
      message: 'Daily log not found. Please refresh the page and try again.'
    }, status: :not_found
    
  rescue => e
    Rails.logger.error "Error saving healing plan log: #{e.message}\n#{e.backtrace.join("\n")}"
    render json: { 
      status: 'error',
      message: 'An unexpected error occurred while saving your journal entry.'
    }, status: :internal_server_error
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
