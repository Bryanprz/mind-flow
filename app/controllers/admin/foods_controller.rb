class Admin::FoodsController < ApplicationController
  before_action :set_admin_food, only: %i[ show edit update destroy ]

  # GET /admin/foods or /admin/foods.json
  def index
    @admin_foods = Admin::Food.all
  end

  # GET /admin/foods/1 or /admin/foods/1.json
  def show
  end

  # GET /admin/foods/new
  def new
    @admin_food = Admin::Food.new
  end

  # GET /admin/foods/1/edit
  def edit
  end

  # POST /admin/foods or /admin/foods.json
  def create
    @admin_food = Admin::Food.new(admin_food_params)

    respond_to do |format|
      if @admin_food.save
        format.html { redirect_to @admin_food, notice: "Food was successfully created." }
        format.json { render :show, status: :created, location: @admin_food }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @admin_food.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/foods/1 or /admin/foods/1.json
  def update
    respond_to do |format|
      if @admin_food.update(admin_food_params)
        format.html { redirect_to @admin_food, notice: "Food was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @admin_food }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @admin_food.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/foods/1 or /admin/foods/1.json
  def destroy
    @admin_food.destroy!

    respond_to do |format|
      format.html { redirect_to admin_foods_path, notice: "Food was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_admin_food
      @admin_food = Admin::Food.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def admin_food_params
      params.fetch(:admin_food, {})
    end
end
