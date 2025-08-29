class RenameCategoryToAssessmentTypeInHealthAssessments < ActiveRecord::Migration[8.0]
  def change
    rename_column :health_assessments, :type, :assessment_type
  end
end
