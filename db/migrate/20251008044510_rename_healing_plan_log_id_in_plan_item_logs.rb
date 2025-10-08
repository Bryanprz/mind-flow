class RenameHealingPlanLogIdInPlanItemLogs < ActiveRecord::Migration[8.0]
  def change
    # Rename the foreign key column from healing_plan_log_id to habit_log_id
    rename_column :plan_item_logs, :healing_plan_log_id, :habit_log_id
    
    # Update the foreign key constraint if it exists
    if foreign_key_exists?(:plan_item_logs, :habit_logs, column: :healing_plan_log_id)
      remove_foreign_key :plan_item_logs, column: :healing_plan_log_id
    end
    
    # Add the updated foreign key
    unless foreign_key_exists?(:plan_item_logs, :habit_logs, column: :habit_log_id)
      add_foreign_key :plan_item_logs, :habit_logs
    end
  end
end
