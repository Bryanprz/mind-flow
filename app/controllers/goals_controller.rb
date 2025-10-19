class GoalsController < ApplicationController
  before_action :set_goal, only: [:show, :edit, :update, :destroy]
  
  def index
    @active_goals = Current.user.goals.active
    @completed_goals = Current.user.goals.completed.limit(10)
  end
  
  def show
  end
  
  def new
    @goal = Current.user.goals.build
  end
  
  def create
    @goal = Current.user.goals.build(goal_params)
    
    if @goal.save
      redirect_to goals_path, notice: "Goal created successfully!"
    else
      render :new, status: :unprocessable_entity
    end
  end
  
  def edit
  end
  
  def update
    if @goal.update(goal_params)
      @goal.auto_complete! # Auto-complete if progress reaches target
      redirect_to goals_path, notice: "Goal updated successfully!"
    else
      render :edit, status: :unprocessable_entity
    end
  end
  
  def destroy
    @goal.destroy
    redirect_to goals_path, notice: "Goal deleted."
  end
  
  private
  
  def set_goal
    @goal = Current.user.goals.find(params[:id])
  end
  
  def goal_params
    params.require(:goal).permit(:title, :description, :target, :progress, :deadline, :category, :icon, :status)
  end
end

