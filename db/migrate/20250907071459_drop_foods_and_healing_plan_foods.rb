class DropFoodsAndHealingPlanFoods < ActiveRecord::Migration[8.0]
  def change
    drop_table :healing_plan_foods
    drop_table :foods
  end
end
