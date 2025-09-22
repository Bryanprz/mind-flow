class RemoveOverviewFromHealingPlan < ActiveRecord::Migration[8.0]
  def change
    remove_column :healing_plans, :overview 
  end
end
