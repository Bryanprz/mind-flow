class CreateQuestions < ActiveRecord::Migration[8.0]
  def change
    create_table :questions do |t|
      t.references :quiz, null: false, foreign_key: true
      t.string :category
      t.string :kosha
      t.text :text
      t.integer :points
      t.timestamps
    end
  end
end
