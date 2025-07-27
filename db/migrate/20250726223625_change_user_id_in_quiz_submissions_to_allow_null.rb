class ChangeUserIdInQuizSubmissionsToAllowNull < ActiveRecord::Migration[8.0]
  def change
    change_column_null :quiz_submissions, :user_id, true
  end
end
