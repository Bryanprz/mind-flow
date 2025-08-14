class CreateQuizSubmissions < ActiveRecord::Migration[8.0]
  def change
    create_table :quiz_submissions do |t|
      t.references :user
      t.references :quiz, null: false
      t.datetime :completed_at
      t.text :results, default: "{}"
      t.timestamps
    end
  end
end
