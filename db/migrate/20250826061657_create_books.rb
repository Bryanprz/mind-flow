class CreateBooks < ActiveRecord::Migration[8.0]
  def change
    create_table :books do |t|
      t.string :title
      t.integer :category

      t.timestamps
    end

    add_index :books, :category
  end
end
