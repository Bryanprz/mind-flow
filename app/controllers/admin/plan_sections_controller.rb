class Admin::PlanSectionsController < ApplicationController
  def move
    @plan_section = PlanSection.find(params[:id])
    # authorize @plan_section # Add authorization logic here if needed
    @plan_section.insert_at(params[:position].to_i)
    head :ok
  end
end
