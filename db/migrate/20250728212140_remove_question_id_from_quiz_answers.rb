class RemoveQuestionIdFromQuizAnswers < ActiveRecord::Migration[8.0]
  def change
    remove_column :quiz_answers, :question_id, :bigint
  end
end
