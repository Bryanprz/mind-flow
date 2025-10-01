class ForceFixSolidCableBroadcasts < ActiveRecord::Migration[8.0]
  def up
    # Drop the table completely
    drop_table :solid_cable_broadcasts if table_exists?(:solid_cable_broadcasts)
    
    # Recreate with proper primary key constraint
    create_table :solid_cable_broadcasts, id: :integer, primary_key: :id do |t|
      t.string :channel, null: false
      t.text :payload, null: false
      t.datetime :created_at, null: false
    end

    # Add the index
    add_index :solid_cable_broadcasts, [:channel, :created_at]

    puts "✅ solid_cable_broadcasts table recreated with proper primary key constraint"
  end

  def down
    # This migration is not easily reversible
    raise ActiveRecord::IrreversibleMigration, "Cannot reverse this migration - it fixes a fundamental table structure issue"
  end
end
