class Admin::PlanItemTemplatesController < ApplicationController
  before_action :set_healing_plan_template
  before_action :set_plan_section_template
  before_action :set_plan_item_template, only: [:edit, :update, :destroy]

  def new
    @plan_item_template = @plan_section_template.plan_item_templates.build
  end

  def create
    @plan_item_template = @plan_section_template.plan_item_templates.build(plan_item_template_params)
    
    # Set position to be the next available position
    max_position = @plan_section_template.plan_item_templates.maximum(:position) || 0
    @plan_item_template.position = max_position + 1

    if @plan_item_template.save
      redirect_to admin_healing_plan_template_path(@healing_plan_template), notice: 'Plan item was successfully created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @plan_item_template.update(plan_item_template_params)
      redirect_to admin_healing_plan_template_path(@healing_plan_template), notice: 'Plan item was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @plan_item_template.destroy
    redirect_to admin_healing_plan_template_path(@healing_plan_template), notice: 'Plan item was successfully deleted.'
  end

  private

  def set_healing_plan_template
    @healing_plan_template = HealingPlanTemplate.find(params[:healing_plan_template_id])
  end

  def set_plan_section_template
    @plan_section_template = @healing_plan_template.plan_section_templates.find(params[:plan_section_template_id])
  end

  def set_plan_item_template
    @plan_item_template = @plan_section_template.plan_item_templates.find(params[:id])
  end

  def plan_item_template_params
    params.require(:plan_item_template).permit(:content, :position)
  end
end
