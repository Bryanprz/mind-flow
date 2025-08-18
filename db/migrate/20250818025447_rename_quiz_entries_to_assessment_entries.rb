class RenameQuizEntriesToAssessmentEntries < ActiveRecord::Migration[8.0]
  def change
    rename_table :quiz_entries, :assessment_entries
    rename_column :assessment_entries, :quiz_id, :health_assessment_id
  end
end