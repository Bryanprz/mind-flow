class DashboardsController < ApplicationController
  before_action :require_prakruti_assessment, only: [:show]

  def show
    @healing_plan = Current.user.active_healing_plan
  end

  private

  def require_prakruti_assessment
    unless Current.user&.prakruti_entry and Current.user&.prakruti_plans
      redirect_to start_prakruti_assessment_path, notice: "Please complete this assessment to access your Dashboard."
    end
  end
end
