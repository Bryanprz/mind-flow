class AddPrimaryKeyToSolidCableBroadcasts < ActiveRecord::Migration[8.0]
  def change
    # Add primary key constraint to the id column
    execute "ALTER TABLE solid_cable_broadcasts ADD CONSTRAINT solid_cable_broadcasts_pkey PRIMARY KEY (id)"
  end
end
