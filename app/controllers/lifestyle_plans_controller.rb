class LifestylePlansController < ApplicationController
  before_action :set_lifestyle_plan, only: %i[ show edit update destroy ]

  # GET /lifestyle_plans or /lifestyle_plans.json
  def index
    @lifestyle_plans = LifestylePlan.all
  end

  # GET /lifestyle_plans/1 or /lifestyle_plans/1.json
  def show
  end

  # GET /lifestyle_plans/new
  def new
    @lifestyle_plan = LifestylePlan.new
  end

  # GET /lifestyle_plans/1/edit
  def edit
  end

  # POST /lifestyle_plans or /lifestyle_plans.json
  def create
    @lifestyle_plan = LifestylePlan.new(lifestyle_plan_params)

    respond_to do |format|
      if @lifestyle_plan.save
        format.html { redirect_to @lifestyle_plan, notice: "Lifestyle plan was successfully created." }
        format.json { render :show, status: :created, location: @lifestyle_plan }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @lifestyle_plan.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /lifestyle_plans/1 or /lifestyle_plans/1.json
  def update
    respond_to do |format|
      if @lifestyle_plan.update(lifestyle_plan_params)
        format.html { redirect_to @lifestyle_plan, notice: "Lifestyle plan was successfully updated." }
        format.json { render :show, status: :ok, location: @lifestyle_plan }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @lifestyle_plan.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /lifestyle_plans/1 or /lifestyle_plans/1.json
  def destroy
    @lifestyle_plan.destroy!

    respond_to do |format|
      format.html { redirect_to lifestyle_plans_path, status: :see_other, notice: "Lifestyle plan was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_lifestyle_plan
      @lifestyle_plan = LifestylePlan.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def lifestyle_plan_params
      params.expect(lifestyle_plan: [ :daily_routine_items, :seasonal_practices_data, :spiritual_practices_items ])
    end
end
