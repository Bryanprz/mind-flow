class CreatePlanItemLogs < ActiveRecord::Migration[8.0]
  def change
    create_table :plan_item_logs do |t|
      t.references :plan_item, null: false, foreign_key: true
      t.references :healing_plan_log, null: false, foreign_key: true
      t.text :note
      t.datetime :completed_at

      t.timestamps
    end
  end
end
