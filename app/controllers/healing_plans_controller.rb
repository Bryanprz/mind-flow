class HealingPlansController < ApplicationController
  before_action :set_healing_plan, only: %i[ show edit update destroy ]
  before_action :require_admin, only: [:index, :new]
  # TODO: Add a before_action to ensure a user is logged in, e.g.:
  # before_action :authenticate_user!

  # GET /healing_plans
  def index
    # Scope plans to the current user and order by version
    @healing_plans = current_user.healing_plans.order(version: :desc)
  end

  # GET /healing_plans/1
  def show
    # Eager load sections and items to prevent N+1 queries
    @plan_sections = @healing_plan.plan_sections.includes(:plan_items).order(:ordering)
  end

  # GET /healing_plans/new
  def new
    # This action just renders the form where users select their goals.
  end

  # POST /healing_plans
  def create
    # Get goals from the form, provide a default empty array if none are selected.
    goals = params.fetch(:goals, [])

    # Use the service to generate the new plan.
    # This assumes you have a `current_user` method for authentication.
    @healing_plan = HealingPlanGeneratorService.new(current_user, goals).call

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
    @healing_plan = current_user.healing_plans.find(params[:id])
  end

  def healing_plan_params
    # These params are used for the update action.
    params.require(:healing_plan).permit(:name, :description)
  end
end
