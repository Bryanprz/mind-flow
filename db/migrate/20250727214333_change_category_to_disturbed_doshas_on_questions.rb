class ChangeCategoryToDisturbedDoshasOnQuestions < ActiveRecord::Migration[7.1]
  def change
    remove_column :questions, :category, :string
    remove_column :questions, :kosha, :string
    add_column :questions, :disturbed_doshas, :string, array: true, default: []
  end
end
