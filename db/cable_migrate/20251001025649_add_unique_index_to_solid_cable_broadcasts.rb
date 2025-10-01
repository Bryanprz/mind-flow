class AddUniqueIndexToSolidCableBroadcasts < ActiveRecord::Migration[8.0]
  def up
    # Check if the unique index already exists
    unless index_exists?(:solid_cable_broadcasts, :id, unique: true)
      add_index :solid_cable_broadcasts, :id, unique: true, name: 'index_solid_cable_broadcasts_on_id_unique'
      puts "✅ Added unique index on id column for solid_cable_broadcasts"
    else
      puts "✅ Unique index on id column already exists"
    end
  end

  def down
    remove_index :solid_cable_broadcasts, name: 'index_solid_cable_broadcasts_on_id_unique' if index_exists?(:solid_cable_broadcasts, :id, unique: true)
  end
end
