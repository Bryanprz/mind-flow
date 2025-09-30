class AddPrimaryKeyToSolidCableBroadcasts < ActiveRecord::Migration[8.0]
  def change
    # SQLite doesn't support ADD CONSTRAINT, so we need to recreate the table
    # First, create a new table with the correct structure
    create_table :solid_cable_broadcasts_new, id: :integer, primary_key: :id do |t|
      t.string :channel, null: false
      t.text :payload, null: false
      t.datetime :created_at, null: false
    end

    add_index :solid_cable_broadcasts_new, [:channel, :created_at]

    # Copy data from old table to new table
    execute "INSERT INTO solid_cable_broadcasts_new SELECT * FROM solid_cable_broadcasts"

    # Drop the old table
    drop_table :solid_cable_broadcasts

    # Rename the new table
    rename_table :solid_cable_broadcasts_new, :solid_cable_broadcasts
  end
end
