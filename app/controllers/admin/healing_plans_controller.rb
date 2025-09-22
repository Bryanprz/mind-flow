class Admin::HealingPlansController < ApplicationController
  before_action :set_user, only: [:new, :create, :show, :edit, :update, :destroy]
  before_action :set_healing_plan, only: [:edit, :update, :destroy]

  def show
    # @user is set by the set_user before_action
    @healing_plan = @user.active_healing_plan

    if @healing_plan.nil?
      redirect_to admin_user_path(@user), alert: "This user does not have an active healing plan."
    end
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
    Rails.logger.info "Raw Healing Plan Params: #{params.inspect}"
    
    if @healing_plan.update(healing_plan_params)
      redirect_to admin_user_healing_plan_path(@user, @healing_plan), notice: 'Healing plan was successfully updated.'
    else
      Rails.logger.error "Failed to update healing plan: #{@healing_plan.errors.full_messages}"
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
    params.require(:healing_plan).permit(
      :name,
      :description,
      (0..3).map { |i| ["focus_area_#{i}".to_sym, "goal_#{i}".to_sym] }.flatten,
      overview: {},
      plan_sections_attributes: [
        :id,
        :_destroy,
        :name,
        :ordering,
        plan_items_attributes: [
          :id,
          :_destroy,
          :content,
          :ordering
        ]
      ]
    )
  end
end
