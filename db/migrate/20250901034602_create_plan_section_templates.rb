class CreatePlanSectionTemplates < ActiveRecord::Migration[8.0]
  def change
    create_table :plan_section_templates do |t|
      t.references :healing_plan_template, null: false, foreign_key: true
      t.string :name
      t.integer :position

      t.timestamps
    end
  end
end
