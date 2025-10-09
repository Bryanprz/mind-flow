class CreateBioProfiles < ActiveRecord::Migration[8.0]
  def change
    create_table :bio_profiles do |t|
      t.string :name, null: false
      t.string :color, null: false
      t.json :archetype_info
      t.json :people_manifestation
      t.text :general_recommendations
      t.timestamps
    end

    add_index :bio_profiles, :name, unique: true

    create_table :bio_profile_healing_foods do |t|
      t.references :bio_profile, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description, null: false
      t.text :recommendations, null: false
      t.timestamps
    end

    create_table :bio_profile_aggravating_foods do |t|
      t.references :bio_profile, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description, null: false
      t.text :recommendations, null: false
      t.timestamps
    end

    create_table :bio_profile_supplements do |t|
      t.references :bio_profile, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description, null: false
      t.timestamps
    end
  end
end