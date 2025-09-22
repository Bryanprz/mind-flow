class Admin::PlanItemsController < ApplicationController
  def move
    @plan_item = PlanItem.find(params[:id])
    # authorize @plan_item # Add authorization logic here if needed
    @plan_item.insert_at(params[:position].to_i)
    head :ok
  end
end
