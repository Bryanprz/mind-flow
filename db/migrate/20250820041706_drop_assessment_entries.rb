class DropAssessmentEntries < ActiveRecord::Migration[8.0]
  def change
    drop_table :assessment_entries
  end
end
