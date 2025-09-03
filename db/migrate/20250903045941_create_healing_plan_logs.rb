class CreateHealingPlanLogs < ActiveRecord::Migration[8.0]
  def change
    create_table :healing_plan_logs do |t|
      t.references :healing_plan, null: false, foreign_key: true
      t.string :start_date
      t.string :completed_at
      t.text :journal_entry

      t.timestamps
    end
  end
end
