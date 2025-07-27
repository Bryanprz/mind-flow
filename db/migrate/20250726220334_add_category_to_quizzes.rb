class AddCategoryToQuizzes < ActiveRecord::Migration[8.0]
  def change
    add_column :quizzes, :category, :integer
  end
end
