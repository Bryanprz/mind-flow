class HabitPlansController < ApplicationController
  before_action :set_habit_plan, only: %i[ edit update destroy ]
  before_action :require_admin, only: [:new]

  def index
    # Scope plans to the current user and order by version
    @habit_plans = Current.user.habit_plans.order(version: :desc)
  end

  def show
    # Check if user has any habit plans at all
    unless Current.user.habit_plans.any?
      redirect_to root_path, alert: "No habit plans found. Please create a habit plan to get started."
      return
    end

    # Use all habit plans
    plan_set = Current.user.habit_plans
    @duration_type = params[:duration_type] || 'daily'

    # Debug logging
    Rails.logger.info "🔍 Looking for habit plan with duration_type: #{@duration_type}"
    Rails.logger.info "🔍 Available plans: #{plan_set.pluck(:duration_type, :id)}"
    Rails.logger.info "🔍 Plan set count: #{plan_set.count}"
    Rails.logger.info "🔍 All user habit plans: #{Current.user.habit_plans.pluck(:duration_type, :id)}"
    Rails.logger.info "🔍 Raw duration_type values: #{plan_set.pluck(:duration_type)}"
    Rails.logger.info "🔍 Enum mapping: daily=#{HabitPlan.duration_types['daily']}, three_month=#{HabitPlan.duration_types['three_month']}, six_month=#{HabitPlan.duration_types['six_month']}"
    
    # Find the specific plan for the selected duration
    @habit_plan = plan_set.find_by(duration_type: @duration_type)

    if @habit_plan.nil?
      # If no plan found for this duration type, show a message instead of redirecting
      Rails.logger.info "🔍 No #{@duration_type} plan found"
      @habit_plan = nil
      @duration_type = params[:duration_type] || 'daily'
      @date = params[:date] ? Time.zone.parse(params[:date]).to_date : Time.zone.today
      @habit_log = nil
      return
    end

    @date = params[:date] ? Time.zone.parse(params[:date]).to_date : Time.zone.today
    # Find existing log or create one if it doesn't exist (needed for journal editing)
    @habit_log = @habit_plan.logs.find_by(date: @date) || 
                 @habit_plan.logs.create!(date: @date)
  end

  def new
  end

  def create
    # Find a basic habit plan template
    habit_plan_template = HabitPlanTemplate.first

    if habit_plan_template.nil?
      redirect_to new_habit_plan_path, alert: "No habit plan template found. Please contact support."
      return
    end

    # Create a new habit plan for the user
    @habit_plan = Current.user.habit_plans.create!(
      name: habit_plan_template.name,
      description: habit_plan_template.description,
      duration_type: habit_plan_template.duration_type,
      habit_plan_template: habit_plan_template,
      is_active: true
    )

    if @habit_plan.persisted?
      redirect_to @habit_plan, notice: "Your new Habit Plan has been created."
    else
      # If creation failed for some reason, render the new template again.
      render :new, status: :unprocessable_entity
    end
  end

  # GET /habit_plans/1/edit
  def edit
  end

  # PATCH/PUT /habit_plans/1
  def update
    if @habit_plan.update(habit_plan_params)
      redirect_to @habit_plan, notice: "Habit plan was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /habit_plans/1
  def destroy
    @habit_plan.destroy!
    redirect_to habit_plans_path, notice: "Habit plan was successfully destroyed."
  end

  def create_daily_log
    habit_plan = HabitPlan.find(params[:habit_plan_id])
    date = params[:date] ? Date.parse(params[:date]) : Date.current
    daily_log = HabitLog.for_date(habit_plan, date)

    if daily_log.persisted?
      render json: { habit_log_id: daily_log.id }, status: :created
    else
      render json: { errors: daily_log.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    head :not_found # Send a 404 if habit_plan not found
  rescue => e
    Rails.logger.error "Error creating daily log: #{e.message}"
    head :internal_server_error # Send a 500 for other errors
  end

  def log_item_progress
    plan_item = PlanItem.find(params[:plan_item_id])
    habit_log = HabitLog.find(params[:habit_log_id])

    if params[:completed]
      # Find or create the log, and update completed_at
      log = PlanItemLog.find_or_initialize_by(
        plan_item: plan_item, 
        habit_log: habit_log
      )
      log.completed_at = Time.current
      log.save!
    else
      PlanItemLog.where(
        plan_item: plan_item,
        habit_log: habit_log
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
    habit_log = HabitLog.find(params[:habit_log_id]) # Find the existing log
    
    if habit_log.update(
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
        errors: habit_log.errors.full_messages,
        message: 'Failed to save journal entry'
      }, status: :unprocessable_entity
    end
    
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "HabitLog not found: #{e.message}"
    render json: { 
      status: 'error',
      message: 'Daily log not found. Please refresh the page and try again.'
    }, status: :not_found
    
  rescue => e
    Rails.logger.error "Error saving habit log: #{e.message}\n#{e.backtrace.join("\n")}"
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

  def set_habit_plan
    # Scope the find to the current user's plans for security.
    @habit_plan = Current.user.habit_plans.find(params[:id])
  end

  def habit_plan_params
    # These params are used for the update action.
    params.require(:habit_plan).permit(:name, :description)
  end
end
