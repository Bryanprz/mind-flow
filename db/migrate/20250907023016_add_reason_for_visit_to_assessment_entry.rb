class AddReasonForVisitToAssessmentEntry < ActiveRecord::Migration[8.0]
  def change
    add_column :assessment_entries, :reason_for_visit, :text
  end
end
