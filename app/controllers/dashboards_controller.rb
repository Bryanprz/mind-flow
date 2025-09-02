class DashboardsController < ApplicationController
  before_action :require_prakruti_assessment, only: [:show]
  def show
  end

  private

  def require_prakruti_assessment
    unless Current.user&.prakruti_entry and Current.user&.prakruti_plan
      redirect_to prakruti_assessment_intro_path, notice: "Please complete this assessment to access your Dashboard."
    end
  end
end
