class CreatePlanItemTemplates < ActiveRecord::Migration[8.0]
  def change
    create_table :plan_item_templates do |t|
      t.references :plan_section_template, null: false, foreign_key: true
      t.text :content
      t.integer :position

      t.timestamps
    end
  end
end
