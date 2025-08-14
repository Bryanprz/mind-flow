class CreateDoshas < ActiveRecord::Migration[8.0]
  def change
    create_table :doshas do |t|
      t.string :name
      t.text :core_qualities
      t.text :strengths
      t.text :growth_areas
      t.text :affirmations
      t.text :archetype_info
      t.text :people_manifestation
      t.string :color
      t.timestamps
      t.index :name, unique: true
    end
  end
end
