class CreateDoshaAggravatingFoods < ActiveRecord::Migration[8.0]
  def change
    create_table :dosha_aggravating_foods do |t|
      t.references :dosha, null: false, foreign_key: true
      t.string :name
      t.text :description
      t.text :recommendations

      t.timestamps
    end
  end
end
