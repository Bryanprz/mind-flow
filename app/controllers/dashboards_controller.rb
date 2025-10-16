class DashboardsController < ApplicationController
  # before_action :require_habit_plan, only: [:show]
  allow_unauthenticated_access only: [:show]
  layout 'with_sidebar'

  def show
    # Temporary: allow access without authentication for testing
    if Current.user.nil?
      @dashboard_props = {
        habitPlan: nil,
        currentUser: nil,
        sectionPresenters: []
      }
      return
    end
    
    @habit_plan = Current.user.active_habit_plan
    
    if @habit_plan.nil?
      @dashboard_props = {
        habitPlan: nil,
        currentUser: current_user_json,
        sectionPresenters: []
      }
      return
    end
    
    @todays_plan_log = @habit_plan.todays_log
    @section_presenters = @habit_plan.plan_sections.map { |section| PlanSectionPresenter.new(section, @todays_plan_log) }
    
    # Prepare data for React
    @dashboard_props = {
      habitPlan: habit_plan_json,
      currentUser: current_user_json,
      sectionPresenters: section_presenters_json
    }
  end

  private

  def require_habit_plan
    unless Current.user&.habit_plans.any?
      redirect_to root_path, notice: "Please create a habit plan to access your Dashboard."
    end
  end
  
  def habit_plan_json
    {
      id: @habit_plan.id,
      name: @habit_plan.name,
      description: @habit_plan.description,
      currentStreak: @habit_plan.current_streak,
      nextMilestone: @habit_plan.next_milestone,
      milestoneProgress: @habit_plan.milestone_progress,
      completedDaysThisMonth: @habit_plan.completed_days_this_month
    }
  end
  
  def current_user_json
    {
      id: Current.user.id,
      name: Current.user.name,
      slug: Current.user.slug,
      hasCheckedInToday: Current.user.has_checked_in_today?
    }
  end
  
  def section_presenters_json
    @section_presenters.map do |presenter|
      {
        name: presenter.name,
        completedToday: presenter.completed_today?,
        firstItemPreview: presenter.first_item_preview
      }
    end
  end
end