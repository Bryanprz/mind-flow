class Admin::DoshaTemplatesController < ApplicationController
  include StandardizedSections
  
  before_action :set_dosha
  before_action :set_healing_plan_templates
  before_action :set_dosha_for_food_actions, only: [:add_healing_food, :remove_healing_food, :add_aggravating_food, :remove_aggravating_food]

  def show
    # Show overview of all healing plan templates for this dosha
    @duration_types = ['daily', 'three_month', 'six_month']
  end

  def edit
    # Edit specific duration type template
    @duration_type = params[:duration_type] || 'daily'
    @healing_plan_template = @healing_plan_templates.find_by(duration_type: @duration_type)
    
    if @healing_plan_template.nil?
      redirect_to admin_dosha_template_path(@dosha.name), 
                  alert: "No #{@duration_type} template found for #{@dosha.name}. Please create one first."
      return
    end
  end

  def update
    @duration_type = params[:duration_type] || 'daily'
    @healing_plan_template = @healing_plan_templates.find_by(duration_type: @duration_type)
    
    if @healing_plan_template.nil?
      redirect_to admin_dosha_template_path(@dosha.name), 
                  alert: "No #{@duration_type} template found for #{@dosha.name}."
      return
    end

    if @healing_plan_template.update(healing_plan_template_params)
      redirect_to admin_dosha_template_path(@dosha.name), 
                  notice: "#{@dosha.name.titleize} #{@duration_type.titleize} template updated successfully."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def add_healing_food
    food_name = params[:food_name].strip
    return redirect_to admin_edit_dosha_template_path(@dosha.name, duration_type: params[:duration_type] || 'daily'), alert: 'Food name cannot be blank.' if food_name.blank?

    food = Food.find_or_create_by(name: food_name)
    
    unless @dosha.foods_that_heal.include?(food)
      @dosha.foods_that_heal << food
      redirect_to admin_edit_dosha_template_path(@dosha.name, duration_type: params[:duration_type] || 'daily'), notice: "#{food.name} added to healing foods."
    else
      redirect_to admin_edit_dosha_template_path(@dosha.name, duration_type: params[:duration_type] || 'daily'), alert: "#{food.name} is already in healing foods."
    end
  end

  def remove_healing_food
    food = Food.find(params[:food_id])
    @dosha.foods_that_heal.delete(food)
    redirect_to admin_edit_dosha_template_path(@dosha.name, duration_type: params[:duration_type] || 'daily'), notice: "#{food.name} removed from healing foods."
  end

  def add_aggravating_food
    food_name = params[:food_name].strip
    return redirect_to admin_edit_dosha_template_path(@dosha.name, duration_type: params[:duration_type] || 'daily'), alert: 'Food name cannot be blank.' if food_name.blank?

    food = Food.find_or_create_by(name: food_name)
    
    unless @dosha.foods_that_aggravate.include?(food)
      @dosha.foods_that_aggravate << food
      redirect_to admin_edit_dosha_template_path(@dosha.name, duration_type: params[:duration_type] || 'daily'), notice: "#{food.name} added to aggravating foods."
    else
      redirect_to admin_edit_dosha_template_path(@dosha.name, duration_type: params[:duration_type] || 'daily'), alert: "#{food.name} is already in aggravating foods."
    end
  end

  def remove_aggravating_food
    food = Food.find(params[:food_id])
    @dosha.foods_that_aggravate.delete(food)
    redirect_to admin_edit_dosha_template_path(@dosha.name, duration_type: params[:duration_type] || 'daily'), notice: "#{food.name} removed from aggravating foods."
  end

  private

  def set_dosha
    dosha_name = params[:dosha_name]&.capitalize
    @dosha = Dosha.find_by(name: dosha_name)
    
    unless @dosha
      redirect_to admin_root_path, alert: "Dosha '#{dosha_name}' not found."
    end
  end

  def set_healing_plan_templates
    @healing_plan_templates = HealingPlanTemplate.where(healing_focus: @dosha)
                                                  .includes(plan_section_templates: :plan_item_templates)
  end

  def set_dosha_for_food_actions
    @dosha = Dosha.find(params[:id])
  end

  def healing_plan_template_params
    params.require(:healing_plan_template).permit(
      :name,
      :description,
      plan_section_templates_attributes: [
        :id,
        :name,
        :position,
        :_destroy,
        plan_item_templates_attributes: [
          :id,
          :content,
          :position,
          :_destroy
        ]
      ]
    )
  end
end
