class CreateLifestylePlan < ActiveRecord::Migration[8.0]
  def change
    create_table "lifestyle_plans" do |t|
      t.json "daily_routine_items"
      t.json "seasonal_practices_data"
      t.json "spiritual_practices_items"
      t.timestamps
    end
  end
end
