class RenameAssessmentSubmissionsToAssessmentEntries < ActiveRecord::Migration[8.0]
  def change
    rename_table :assessment_submissions, :assessment_entries
  end
end
