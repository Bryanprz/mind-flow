class AddDurationTypeToHealingPlans < ActiveRecord::Migration[8.0]
  def change
    add_column :healing_plans, :duration_type, :integer
  end
end
