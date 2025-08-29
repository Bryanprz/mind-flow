class AddTypeAndNotesToAssessmentEntries < ActiveRecord::Migration[8.0]
  def change
    add_column :assessment_entries, :type, :string
    add_column :assessment_entries, :notes, :text
  end
end
