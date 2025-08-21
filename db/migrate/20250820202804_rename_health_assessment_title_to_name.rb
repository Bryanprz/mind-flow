class RenameHealthAssessmentTitleToName < ActiveRecord::Migration[8.0]
  def change
    rename_column :health_assessments, :title, :name
  end
end
