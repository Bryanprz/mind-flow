class DashboardsController < ApplicationController
  before_action :require_prakruti_assessment, only: [:show]

  def show
    @healing_plan = Current.user.active_healing_plan
    
    if @healing_plan.nil?
      redirect_to new_healing_plan_path, notice: "Please create a healing plan to access your dashboard."
      return
    end
    
    @todays_plan_log = @healing_plan.todays_log
    @section_presenters = @healing_plan.plan_sections.map { |section| PlanSectionPresenter.new(section, @todays_plan_log) }
  end

  private

  def require_prakruti_assessment
    unless Current.user&.prakruti_entry and Current.user&.healing_plans.any?
      redirect_to start_prakruti_assessment_path, notice: "Please complete this assessment to access your Dashboard."
    end
  end
end
