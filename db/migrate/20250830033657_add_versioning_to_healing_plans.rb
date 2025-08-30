class AddVersioningToHealingPlans < ActiveRecord::Migration[8.0]
  def change
    add_column :healing_plans, :version, :integer
    add_column :healing_plans, :lineage_id, :string
    add_column :healing_plans, :is_active, :boolean
  end
end
