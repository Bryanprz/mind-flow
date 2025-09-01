class AddTypeToHealingPlans < ActiveRecord::Migration[8.0]
  def change
    add_column :healing_plans, :type, :string
    add_index :healing_plans, :type
  end
end
