class MovePointsFromQuizOptionToQuestion < ActiveRecord::Migration[7.1]
  def change
    remove_column :quiz_options, :points, :integer
    add_column :questions, :points, :integer
  end
end