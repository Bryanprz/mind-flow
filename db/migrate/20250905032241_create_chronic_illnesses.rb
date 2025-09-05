class CreateChronicIllnesses < ActiveRecord::Migration[8.0]
  def change
    create_table :chronic_illnesses do |t|
      t.string :name
      t.text :description
      t.string :icon

      t.timestamps
    end
  end
end
