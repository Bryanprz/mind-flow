class AddOverviewToHealingPlans < ActiveRecord::Migration[8.0]
  def change
    add_column :healing_plans, :overview, :json
  end
end
