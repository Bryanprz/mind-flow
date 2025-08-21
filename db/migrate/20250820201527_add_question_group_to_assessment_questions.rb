class AddQuestionGroupToAssessmentQuestions < ActiveRecord::Migration[8.0]
  def change
    add_column :assessment_questions, :question_group, :string
  end
end
