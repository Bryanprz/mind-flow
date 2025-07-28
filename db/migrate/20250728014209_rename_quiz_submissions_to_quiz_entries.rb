class RenameQuizSubmissionsToQuizEntries < ActiveRecord::Migration[7.1]
  def change
    rename_table :quiz_submissions, :quiz_entries
    rename_column :quiz_answers, :quiz_submission_id, :quiz_entry_id
  end
end