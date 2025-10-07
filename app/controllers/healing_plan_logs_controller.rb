class HealingPlanLogsController < ApplicationController
  before_action :require_prakruti_assessment, only: [:index, :show]

  def index
    # Check if user wants to see all logs or just the week view
    if params[:view] == 'all'
      # Show all logs in table format
      @all_logs = Current.user.active_healing_plan.logs
        .order(date: :desc)
        .limit(50) # Limit to prevent performance issues
      @show_week_view = false
    else
      # Show 7-day week view (default)
      @week_start = Date.current - 6.days
      @week_end = Date.current
      
      # Get existing logs for this week
      @existing_logs = Current.user.active_healing_plan.logs
        .where(date: @week_start..@week_end)
        .index_by(&:date)
      
      # Create virtual week structure
      @week_days = (@week_start..@week_end).map do |date|
        {
          date: date,
          log: @existing_logs[date],
          is_today: date == Date.current,
          is_future: date > Date.current,
          is_completed: @existing_logs[date]&.completed_at.present?
        }
      end
      @show_week_view = true
    end
  end

  def show
  end

  private

  def require_prakruti_assessment
    unless Current.user&.prakruti_entry && Current.user&.healing_plans.any?
      redirect_to start_prakruti_assessment_path, alert: "Please complete your assessment first to access your healing plan logs. This will help us create a personalized healing plan for you."
      return
    end
  end
end
