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
    Rails.logger.info "Healing Plan Params: #{healing_plan_params.inspect}"
    
    # Manually process the parameters to ensure they're in the correct format
    params = healing_plan_params.dup
    
    # Process plan_sections_attributes to ensure proper format for nested attributes
    if params[:plan_sections_attributes].present?
      sections_attrs = params[:plan_sections_attributes].values
      
      sections_attrs.each_with_index do |section_attrs, section_index|
        if section_attrs[:plan_items_attributes].present?
          # Convert the plan_items_attributes to an array if it's a hash
          items_attrs = section_attrs[:plan_items_attributes].is_a?(Array) ? 
                       section_attrs[:plan_items_attributes] : 
                       section_attrs[:plan_items_attributes].values
          
          section_attrs[:plan_items_attributes] = items_attrs.each_with_index.map do |item_attrs, item_index|
            # Ensure _destroy is properly set
            item_attrs[:_destroy] = item_attrs[:_destroy] == '1' if item_attrs[:_destroy].present?
            item_attrs
          end
        end
      end
      
      params[:plan_sections_attributes] = sections_attrs.each_with_index.map { |attrs, i| [i.to_s, attrs] }.to_h
    end
    
    if @healing_plan.update(params)
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
    key = [:prakruti_plan, :vikruti_plan, :healing_plan].find { |k| params.key?(k) }
    params.require(key).permit(
      :name,
      :description,
      :focus_area_0, :goal_0,
      :focus_area_1, :goal_1,
      :focus_area_2, :goal_2,
      :focus_area_3, :goal_3,
      overview: {},
      plan_sections_attributes: [
        :id,
        :_destroy,
        :name,
        plan_items_attributes: [
          :id,
          :_destroy,
          :content
        ]
      ]
    )
  end
end