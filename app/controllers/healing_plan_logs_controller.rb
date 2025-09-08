class HealingPlanLogsController < ApplicationController
  def index
    @healing_plan_logs = Current.user.active_healing_plan.logs
  end

  def show
  end
end
