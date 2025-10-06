class CreateChronicIllnessAffectedDhatus < ActiveRecord::Migration[8.0]
  def change
    create_table :chronic_illness_affected_dhatus do |t|
      t.references :chronic_illness, null: false, foreign_key: true
      t.references :dhatu, null: false, foreign_key: true

      t.timestamps
    end
  end
end
