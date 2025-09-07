class CreateDoshaHealingHerbs < ActiveRecord::Migration[8.0]
  def change
    create_table :dosha_healing_herbs do |t|
      t.references :dosha, null: false, foreign_key: true
      t.string :name
      t.text :description
      t.text :recommendations

      t.timestamps
    end
  end
end
