class CreateAssessmentChronicIllnesses < ActiveRecord::Migration[8.0]
  def change
    create_table :assessment_chronic_illnesses do |t|
      t.references :assessment_entry, null: false, foreign_key: true
      t.references :chronic_illness, null: false, foreign_key: true

      t.timestamps
    end
  end
end
