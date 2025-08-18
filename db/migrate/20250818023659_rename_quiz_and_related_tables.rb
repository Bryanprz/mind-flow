class RenameQuizAndRelatedTables < ActiveRecord::Migration[8.0]
  def change
    # Rename tables
    rename_table :quizzes, :health_assessments
    rename_table :questions, :assessment_questions
    rename_table :quiz_submissions, :assessment_submissions
    rename_table :quiz_answers, :assessment_answers
    rename_table :quiz_options, :assessment_options

    # Rename foreign key columns
    rename_column :assessment_questions, :quiz_id, :health_assessment_id
    rename_column :assessment_submissions, :quiz_id, :health_assessment_id
    rename_column :assessment_answers, :quiz_submission_id, :assessment_submission_id
    rename_column :assessment_answers, :quiz_option_id, :assessment_option_id
    rename_column :assessment_options, :question_id, :assessment_question_id
  end
end