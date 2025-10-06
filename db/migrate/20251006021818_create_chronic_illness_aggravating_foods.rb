class CreateChronicIllnessAggravatingFoods < ActiveRecord::Migration[8.0]
  def change
    create_table :chronic_illness_aggravating_foods do |t|
      t.references :chronic_illness, null: false, foreign_key: true
      t.references :food, null: false, foreign_key: true

      t.timestamps
    end
  end
end
