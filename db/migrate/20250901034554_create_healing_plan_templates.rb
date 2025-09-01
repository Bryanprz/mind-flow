class CreateHealingPlanTemplates < ActiveRecord::Migration[8.0]
  def change
    create_table :healing_plan_templates do |t|
      t.string :name
      t.text :description
      t.references :dosha, null: false, foreign_key: true

      t.timestamps
    end
  end
end
