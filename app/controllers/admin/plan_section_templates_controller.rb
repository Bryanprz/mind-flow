class Admin::PlanSectionTemplatesController < ApplicationController
  before_action :set_healing_plan_template
  before_action :set_plan_section_template, only: [:edit, :update, :destroy]

  def new
    @plan_section_template = @healing_plan_template.plan_section_templates.build
  end

  def create
    @plan_section_template = @healing_plan_template.plan_section_templates.build(plan_section_template_params)
    
    # Set position to be the next available position
    max_position = @healing_plan_template.plan_section_templates.maximum(:position) || 0
    @plan_section_template.position = max_position + 1

    if @plan_section_template.save
      redirect_to admin_healing_plan_template_path(@healing_plan_template), notice: 'Plan section was successfully created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @plan_section_template.update(plan_section_template_params)
      redirect_to admin_healing_plan_template_path(@healing_plan_template), notice: 'Plan section was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @plan_section_template.destroy
    redirect_to admin_healing_plan_template_path(@healing_plan_template), notice: 'Plan section was successfully deleted.'
  end

  private

  def set_healing_plan_template
    @healing_plan_template = HealingPlanTemplate.find(params[:healing_plan_template_id])
  end

  def set_plan_section_template
    @plan_section_template = @healing_plan_template.plan_section_templates.find(params[:id])
  end

  def plan_section_template_params
    params.require(:plan_section_template).permit(:name, :position)
  end
end
