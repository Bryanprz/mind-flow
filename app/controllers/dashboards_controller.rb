class DashboardsController < ApplicationController
  before_action :require_habit_plan, only: [:show]

  def show
    @habit_plan = Current.user.active_habit_plan
    
    if @habit_plan.nil?
      redirect_to root_path, notice: "Please create a habit plan to access your dashboard."
      return
    end
    
    @todays_plan_log = @habit_plan.todays_log
    @section_presenters = @habit_plan.plan_sections.map { |section| PlanSectionPresenter.new(section, @todays_plan_log) }
  end

  private

  def require_habit_plan
    unless Current.user&.habit_plans.any?
      redirect_to root_path, notice: "Please create a habit plan to access your Dashboard."
    end
  end
end
