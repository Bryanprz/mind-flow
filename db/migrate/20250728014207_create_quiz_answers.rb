class CreateQuizAnswers < ActiveRecord::Migration[8.0]
  def change
    create_table :quiz_answers do |t|
      t.references :quiz_submission, null: false, foreign_key: true
      t.references :question, null: false, foreign_key: true
      t.references :quiz_option, null: false, foreign_key: true
      t.timestamps
    end
  end
end
