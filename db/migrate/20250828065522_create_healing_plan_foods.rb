class CreateHealingPlanFoods < ActiveRecord::Migration[8.0]
  def change
    create_table :healing_plan_foods do |t|
      t.references :healing_plan, null: false, foreign_key: true
      t.references :food, null: false, foreign_key: true

      t.timestamps
    end
  end
end
