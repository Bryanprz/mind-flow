class CreateSolidCableBroadcasts < ActiveRecord::Migration[8.0]
  def change
    create_table :solid_cable_broadcasts do |t|
      t.string :channel, null: false
      t.text :payload, null: false
      t.datetime :created_at, null: false
    end

    add_index :solid_cable_broadcasts, [:channel, :created_at]
  end
end
