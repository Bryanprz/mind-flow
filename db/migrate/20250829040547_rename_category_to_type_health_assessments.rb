class RenameCategoryToTypeHealthAssessments < ActiveRecord::Migration[8.0]
  def change
    rename_column :health_assessments, :category, :type
  end
end
