class CreateQuizEntries < ActiveRecord::Migration[8.0]
  def change
    create_table :quiz_entries do |t|
      t.references :quiz, null: false, foreign_key: true
      t.references :user, null: true, foreign_key: true
      t.datetime :completed_at
      t.json :results, default: {}

      t.timestamps
    end
  end
end
