class CreatePlanItems < ActiveRecord::Migration[8.0]
  def change
    create_table :plan_items do |t|
      t.text :content
      t.boolean :completed, default: false
      t.integer :ordering
      t.references :plan_section, null: false, foreign_key: true

      t.timestamps
    end
  end
end
