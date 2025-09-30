class FixSolidCableBroadcastsPrimaryKey < ActiveRecord::Migration[8.0]
  def up
    # Backup existing data first
    execute "CREATE TEMPORARY TABLE solid_cable_broadcasts_backup AS SELECT * FROM solid_cable_broadcasts"
    
    # Drop the existing table
    drop_table :solid_cable_broadcasts
    
    # Recreate with proper primary key constraint
    create_table :solid_cable_broadcasts, id: :integer, primary_key: :id do |t|
      t.string :channel, null: false
      t.text :payload, null: false
      t.datetime :created_at, null: false
    end
    
    # Add the index
    add_index :solid_cable_broadcasts, [:channel, :created_at]
    
    # Restore the data
    execute "INSERT INTO solid_cable_broadcasts SELECT * FROM solid_cable_broadcasts_backup"
    execute "DROP TABLE solid_cable_broadcasts_backup"
    
    puts "✅ solid_cable_broadcasts table recreated with proper primary key"
  end
  
  def down
    # This migration is not easily reversible, but that's okay
    # since we're fixing a fundamental table structure issue
    raise ActiveRecord::IrreversibleMigration, "Cannot reverse this migration - it fixes a fundamental table structure issue"
  end
end
