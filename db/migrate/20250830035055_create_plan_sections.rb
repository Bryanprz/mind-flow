class CreatePlanSections < ActiveRecord::Migration[8.0]
  def change
    create_table :plan_sections do |t|
      t.string :name
      t.integer :ordering
      t.references :healing_plan, null: false, foreign_key: true

      t.timestamps
    end
  end
end
