class Admin::PlanSectionsController < ApplicationController
  def move
    @plan_section = PlanSection.find(params[:id])
    # authorize @plan_section # Add authorization logic here if needed
    
    requested_position = params[:position].to_i
    @plan_section.set_list_position(requested_position)
    
    render json: { success: true }
  end
end
