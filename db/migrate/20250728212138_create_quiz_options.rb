class CreateQuizOptions < ActiveRecord::Migration[8.0]
  def change
    create_table :quiz_options do |t|
      t.references :question, null: false, foreign_key: true
      t.string :text
      t.integer :dosha
      t.timestamps
    end
  end
end
