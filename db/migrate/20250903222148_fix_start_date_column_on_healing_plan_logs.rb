class FixStartDateColumnOnHealingPlanLogs < ActiveRecord::Migration[7.1]
  def change
    # This is a destructive migration. It's okay because the user confirmed
    # that preserving data in the old 'start_date' column is not necessary.

    # Remove the old, incorrect string column
    remove_column :healing_plan_logs, :start_date, :string

    # Add the new, correct date column
    add_column :healing_plan_logs, :date, :date
  end
end