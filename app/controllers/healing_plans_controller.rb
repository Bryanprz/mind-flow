class HealingPlansController < ApplicationController
  before_action :set_healing_plan, only: %i[ show edit update destroy ]

  # GET /healing_plans or /healing_plans.json
  def index
    @healing_plans = HealingPlan.all
  end

  # GET /healing_plans/1 or /healing_plans/1.json
  def show
  end

  # GET /healing_plans/new
  def new
    @healing_plan = HealingPlan.new
  end

  # GET /healing_plans/1/edit
  def edit
  end

  # POST /healing_plans or /healing_plans.json
  def create
    @healing_plan = HealingPlan.new(healing_plan_params)

    respond_to do |format|
      if @healing_plan.save
        format.html { redirect_to @healing_plan, notice: "Healing plan was successfully created." }
        format.json { render :show, status: :created, location: @healing_plan }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @healing_plan.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /healing_plans/1 or /healing_plans/1.json
  def update
    respond_to do |format|
      if @healing_plan.update(healing_plan_params)
        format.html { redirect_to @healing_plan, notice: "Healing plan was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @healing_plan }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @healing_plan.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /healing_plans/1 or /healing_plans/1.json
  def destroy
    @healing_plan.destroy!

    respond_to do |format|
      format.html { redirect_to healing_plans_path, notice: "Healing plan was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_healing_plan
      @healing_plan = HealingPlan.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def healing_plan_params
      params.expect(healing_plan: [ :user_id, :title, :description ])
    end
end
