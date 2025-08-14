class UpdateQuizAnswersToUseQuizSubmission < ActiveRecord::Migration[8.0]
  def up
    # Check if the column already exists
    unless column_exists?(:quiz_answers, :quiz_submission_id)
      # Add the new column (nullable for now)
      add_reference :quiz_answers, :quiz_submission, foreign_key: true, null: true
    end
    
    # Only try to copy data if quiz_entries table exists and has data
    if table_exists?(:quiz_entries) && column_exists?(:quiz_entries, :quiz_submission_id)
      # Copy data from quiz_entry to quiz_submission
      execute <<-SQL
        UPDATE quiz_answers 
        SET quiz_submission_id = quiz_entries.quiz_submission_id
        FROM quiz_entries
        WHERE quiz_answers.quiz_entry_id = quiz_entries.id
          AND quiz_answers.quiz_submission_id IS NULL
      SQL
    end
    
    # Remove the old foreign key if it exists
    if foreign_key_exists?(:quiz_answers, :quiz_entries)
      remove_foreign_key :quiz_answers, :quiz_entries
    end
    
    # Remove the old column if it exists
    if column_exists?(:quiz_answers, :quiz_entry_id)
      remove_column :quiz_answers, :quiz_entry_id
    end
    
    # Make the new column non-nullable if it exists
    if column_exists?(:quiz_answers, :quiz_submission_id)
      change_column_null :quiz_answers, :quiz_submission_id, false
    end
  end

  def down
    # This is a one-way migration since we're removing data
    raise ActiveRecord::IrreversibleMigration, "Can't recover the deleted quiz_entry_id data"
  end
end
