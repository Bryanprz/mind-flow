class Admin::PlanSectionTemplatesController < ApplicationController
  before_action :set_plan_section_template, only: [:update]

  def update
    respond_to do |format|
      if @plan_section_template.update(plan_section_template_params)
        format.turbo_stream {
          render turbo_stream: turbo_stream.replace(
            "section_#{@plan_section_template.id}_save_btn",
            partial: "admin/plan_section_templates/save_button",
            locals: { section: @plan_section_template, field: params[:field] }
          )
        }
        format.html { redirect_back(fallback_location: admin_root_path) }
      else
        format.turbo_stream {
          render turbo_stream: turbo_stream.replace(
            "section_#{@plan_section_template.id}_save_btn",
            partial: "admin/plan_section_templates/save_button",
            locals: { section: @plan_section_template, field: params[:field], errors: @plan_section_template.errors }
          )
        }
        format.html { redirect_back(fallback_location: admin_root_path) }
      end
    end
  end

  private

  def set_plan_section_template
    @plan_section_template = PlanSectionTemplate.find(params[:id])
  end

  def plan_section_template_params
    params.require(:plan_section_template).permit(:name, :position)
  end
end
