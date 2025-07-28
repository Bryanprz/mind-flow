class RemoveDisturbedDoshasFromQuestions < ActiveRecord::Migration[8.0]
  def change
    remove_column :questions, :disturbed_doshas, :string
  end
end
