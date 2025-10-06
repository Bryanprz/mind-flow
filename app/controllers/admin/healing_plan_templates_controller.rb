class Admin::HealingPlanTemplatesController < ApplicationController
  before_action :set_healing_plan_template, only: [:show, :edit, :update, :destroy]
  before_action :set_chronic_illness, only: [:new, :create]

  def index
    @healing_plan_templates = HealingPlanTemplate.includes(:healing_focus).order(:name)
  end

  def show
  end

  def new
    @healing_plan_template = @chronic_illness.healing_plan_templates.build
  end

  def create
    @healing_plan_template = @chronic_illness.healing_plan_templates.build(healing_plan_template_params)

    if @healing_plan_template.save
      redirect_to admin_healing_plan_template_path(@healing_plan_template), notice: 'Healing plan template was successfully created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @healing_plan_template.update(healing_plan_template_params)
      redirect_to admin_healing_plan_template_path(@healing_plan_template), notice: 'Healing plan template was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    chronic_illness = @healing_plan_template.healing_focus
    @healing_plan_template.destroy
    redirect_to admin_chronic_illness_path(chronic_illness), notice: 'Healing plan template was successfully deleted.'
  end

  private

  def set_chronic_illness
    @chronic_illness = ChronicIllness.find(params[:chronic_illness_id])
  end

  def set_healing_plan_template
    @healing_plan_template = HealingPlanTemplate.find(params[:id])
  end

  def healing_plan_template_params
    params.require(:healing_plan_template).permit(:name, :description, :duration_type)
  end
end
