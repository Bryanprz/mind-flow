class RenameTitleToNameInHealingPlans < ActiveRecord::Migration[7.1]
  def change
    rename_column :healing_plans, :title, :name
  end
end