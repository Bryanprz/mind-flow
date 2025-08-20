class RenameAssessmentSubmissionIdInAssessmentAnswers < ActiveRecord::Migration[8.0]
  def change
    rename_column :assessment_answers, :assessment_submission_id, :assessment_entry_id
  end
end
