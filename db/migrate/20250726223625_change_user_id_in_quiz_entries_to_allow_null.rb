class ChangeUserIdInQuizEntriesToAllowNull < ActiveRecord::Migration[8.0]
  def change
    change_column_null :quiz_entries, :user_id, true
  end
end
