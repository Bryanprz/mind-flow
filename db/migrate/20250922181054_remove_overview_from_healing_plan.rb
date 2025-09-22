class RemoveOverviewFromHealingPlan < ActiveRecord::Migration[8.0]
  def up
    remove_column :healing_plans, :overview
  end

  def down
    add_column :healing_plans, :overview, :json
  end
end
