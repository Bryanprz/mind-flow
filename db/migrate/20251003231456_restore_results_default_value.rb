class RestoreResultsDefaultValue < ActiveRecord::Migration[8.0]
  def change
    # Restore the default value of {} for the results column
    # This was lost during our encryption column size changes
    change_column_default :assessment_entries, :results, "{}"
  end
end