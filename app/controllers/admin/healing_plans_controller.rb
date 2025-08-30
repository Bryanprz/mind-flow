class Admin::HealingPlansController < ApplicationController
  before_action :set_user, only: [:new, :create, :show, :edit, :update, :destroy]
  before_action :set_healing_plan, only: [:show, :edit, :update, :destroy]

  def show
  end

  def new
    @healing_plan = @user.healing_plans.build
  end

  def create
    @healing_plan = @user.healing_plans.build(healing_plan_params)

    if @healing_plan.save
      redirect_to admin_user_healing_plan_path(@user, @healing_plan), notice: 'Healing plan was successfully created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @healing_plan.update(healing_plan_params)
      redirect_to admin_user_healing_plan_path(@user, @healing_plan), notice: 'Healing plan was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @healing_plan.destroy!

    respond_to do |format|
      format.html { redirect_to admin_user_path(@user), status: :see_other, notice: "Healing Plan was successfully deleted." }
      format.json { head :no_content }
    end
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  end

  def set_healing_plan
    @healing_plan = @user.healing_plans.find(params[:id])
  end

  def healing_plan_params
    params.require(:healing_plan).permit(:name, :description)
  end
end