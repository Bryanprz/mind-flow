class HealingPlanFoodsController < ApplicationController
  before_action :set_healing_plan_food, only: %i[ show edit update destroy ]

  # GET /healing_plan_foods or /healing_plan_foods.json
  def index
    @healing_plan_foods = HealingPlanFood.all
  end

  # GET /healing_plan_foods/1 or /healing_plan_foods/1.json
  def show
  end

  # GET /healing_plan_foods/new
  def new
    @healing_plan_food = HealingPlanFood.new
  end

  # GET /healing_plan_foods/1/edit
  def edit
  end

  # POST /healing_plan_foods or /healing_plan_foods.json
  def create
    @healing_plan_food = HealingPlanFood.new(healing_plan_food_params)

    respond_to do |format|
      if @healing_plan_food.save
        format.html { redirect_to @healing_plan_food, notice: "Healing plan food was successfully created." }
        format.json { render :show, status: :created, location: @healing_plan_food }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @healing_plan_food.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /healing_plan_foods/1 or /healing_plan_foods/1.json
  def update
    respond_to do |format|
      if @healing_plan_food.update(healing_plan_food_params)
        format.html { redirect_to @healing_plan_food, notice: "Healing plan food was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @healing_plan_food }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @healing_plan_food.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /healing_plan_foods/1 or /healing_plan_foods/1.json
  def destroy
    @healing_plan_food.destroy!

    respond_to do |format|
      format.html { redirect_to healing_plan_foods_path, notice: "Healing plan food was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_healing_plan_food
      @healing_plan_food = HealingPlanFood.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def healing_plan_food_params
      params.expect(healing_plan_food: [ :healing_plan_id, :food_id ])
    end
end
