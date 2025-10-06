class Admin::ChronicIllnessesController < ApplicationController
  before_action :set_chronic_illness, only: [:show, :edit, :update, :destroy, :add_healing_food, :remove_healing_food, :add_aggravating_food, :remove_aggravating_food]

  def index
    @chronic_illnesses = ChronicIllness.all.order(:name)
  end

  def show
  end

  def new
    @chronic_illness = ChronicIllness.new
  end

  def edit
  end

  def create
    @chronic_illness = ChronicIllness.new(chronic_illness_params)

    if @chronic_illness.save
      redirect_to admin_chronic_illness_path(@chronic_illness), notice: 'Chronic illness was successfully created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @chronic_illness.update(chronic_illness_params)
      redirect_to admin_chronic_illness_path(@chronic_illness), notice: 'Chronic illness was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @chronic_illness.destroy
    redirect_to admin_chronic_illnesses_path, notice: 'Chronic illness was successfully deleted.'
  end

  def add_healing_food
    food_name = params[:food_name].strip
    return redirect_to admin_chronic_illness_path(@chronic_illness), alert: 'Food name cannot be blank.' if food_name.blank?

    food = Food.find_or_create_by(name: food_name)
    
    unless @chronic_illness.healing_foods.include?(food)
      @chronic_illness.healing_foods << food
      redirect_to admin_chronic_illness_path(@chronic_illness), notice: "#{food.name} added to healing foods."
    else
      redirect_to admin_chronic_illness_path(@chronic_illness), alert: "#{food.name} is already in healing foods."
    end
  end

  def remove_healing_food
    food = Food.find(params[:food_id])
    @chronic_illness.healing_foods.delete(food)
    redirect_to admin_chronic_illness_path(@chronic_illness), notice: "#{food.name} removed from healing foods."
  end

  def add_aggravating_food
    food_name = params[:food_name].strip
    return redirect_to admin_chronic_illness_path(@chronic_illness), alert: 'Food name cannot be blank.' if food_name.blank?

    food = Food.find_or_create_by(name: food_name)
    
    unless @chronic_illness.aggravating_foods.include?(food)
      @chronic_illness.aggravating_foods << food
      redirect_to admin_chronic_illness_path(@chronic_illness), notice: "#{food.name} added to aggravating foods."
    else
      redirect_to admin_chronic_illness_path(@chronic_illness), alert: "#{food.name} is already in aggravating foods."
    end
  end

  def remove_aggravating_food
    food = Food.find(params[:food_id])
    @chronic_illness.aggravating_foods.delete(food)
    redirect_to admin_chronic_illness_path(@chronic_illness), notice: "#{food.name} removed from aggravating foods."
  end

  private

  def set_chronic_illness
    @chronic_illness = ChronicIllness.find(params[:id])
  end

  def chronic_illness_params
    params.require(:chronic_illness).permit(:name, :sanskrit_name, :allo_description, :ayu_description, :disease_evolution, :effects, :causes, :manifestation, :color)
  end
end
