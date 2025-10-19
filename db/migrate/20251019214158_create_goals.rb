class CreateGoals < ActiveRecord::Migration[8.0]
  def change
    create_table :goals do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.text :description
      t.integer :target, null: false, default: 100
      t.integer :progress, null: false, default: 0
      t.date :deadline
      t.string :category
      t.integer :status, null: false, default: 0
      t.string :icon

      t.timestamps
    end

    add_index :goals, [:user_id, :status]
    add_index :goals, [:user_id, :deadline]
  end
end
