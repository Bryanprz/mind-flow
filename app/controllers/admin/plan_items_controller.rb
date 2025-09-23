class Admin::PlanItemsController < ApplicationController
  def move
    @plan_item = PlanItem.find(params[:id])
    # authorize @plan_item # Add authorization logic here if needed
    
    requested_position = params[:position].to_i
    @plan_item.set_list_position(requested_position)
    
    render json: { success: true }
  end
end
