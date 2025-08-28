class CreateHealingPlans < ActiveRecord::Migration[8.0]
  def change
    create_table :healing_plans do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title
      t.text :description

      t.timestamps
    end
  end
end
