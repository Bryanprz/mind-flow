class CreateHealingPlanTemplatesTable < ActiveRecord::Migration[8.0]
  def change
    create_table :healing_plan_templates do |t|
      t.string :name
      t.text :description
      t.string :duration_type
      t.references :healing_focus, polymorphic: true, null: false
      t.timestamps
    end
  end
end