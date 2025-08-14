class RenameQuizSubmissionsToQuizEntries < ActiveRecord::Migration[7.1]
  def change
    # This migration is intentionally left empty to fix a schema inconsistency.
    # The quiz_entries table is now created by a different migration.
  end
end
