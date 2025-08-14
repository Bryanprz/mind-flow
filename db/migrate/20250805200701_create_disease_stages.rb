class CreateDiseaseStages < ActiveRecord::Migration[8.0]
  def change
    create_table :disease_stages do |t|
      t.integer :formation_stage
      t.string :name
      t.text :description
      t.timestamps
    end
  end
end
