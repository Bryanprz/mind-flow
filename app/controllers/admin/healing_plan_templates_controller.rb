class Admin::HealingPlanTemplatesController < ApplicationController
  before_action :set_chronic_illness
  before_action :set_healing_plan_template, only: [:edit, :update, :destroy]

  def new
    @healing_plan_template = @chronic_illness.healing_plan_templates.build
  end

  def create
    @healing_plan_template = @chronic_illness.healing_plan_templates.build(healing_plan_template_params)

    if @healing_plan_template.save
      redirect_to admin_chronic_illness_path(@chronic_illness), notice: 'Healing plan template was successfully created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @healing_plan_template.update(healing_plan_template_params)
      redirect_to admin_chronic_illness_path(@chronic_illness), notice: 'Healing plan template was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @healing_plan_template.destroy
    redirect_to admin_chronic_illness_path(@chronic_illness), notice: 'Healing plan template was successfully deleted.'
  end

  private

  def set_chronic_illness
    @chronic_illness = ChronicIllness.find(params[:chronic_illness_id])
  end

  def set_healing_plan_template
    @healing_plan_template = @chronic_illness.healing_plan_templates.find(params[:id])
  end

  def healing_plan_template_params
    params.require(:healing_plan_template).permit(:name, :description, :duration_type)
  end
end
