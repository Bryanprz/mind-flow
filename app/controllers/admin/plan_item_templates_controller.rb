class Admin::PlanItemTemplatesController < ApplicationController
  before_action :set_plan_item_template, only: [:update]

  def update
    respond_to do |format|
      if @plan_item_template.update(plan_item_template_params)
        format.turbo_stream {
          render turbo_stream: turbo_stream.replace(
            "item_#{@plan_item_template.id}_save_btn",
            partial: "admin/plan_item_templates/save_button",
            locals: { item: @plan_item_template, field: params[:field] }
          )
        }
        format.html { redirect_back(fallback_location: admin_root_path) }
      else
        format.turbo_stream {
          render turbo_stream: turbo_stream.replace(
            "item_#{@plan_item_template.id}_save_btn",
            partial: "admin/plan_item_templates/save_button",
            locals: { item: @plan_item_template, field: params[:field], errors: @plan_item_template.errors }
          )
        }
        format.html { redirect_back(fallback_location: admin_root_path) }
      end
    end
  end

  private

  def set_plan_item_template
    @plan_item_template = PlanItemTemplate.find(params[:id])
  end

  def plan_item_template_params
    params.require(:plan_item_template).permit(:content, :position)
  end
end
