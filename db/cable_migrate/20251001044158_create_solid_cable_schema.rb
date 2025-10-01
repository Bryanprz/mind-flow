# db/migrate/[timestamp]_create_solid_cable_schema.rb
class CreateSolidCableSchema < ActiveRecord::Migration[8.0]
  def change
    # Drop any existing tables to start fresh
    drop_table :solid_cable_broadcasts if table_exists?(:solid_cable_broadcasts)
    drop_table :solid_cable_messages if table_exists?(:solid_cable_messages)
    drop_table :solid_cable_processes if table_exists?(:solid_cable_processes)

    # Create standard SolidCable tables
    create_table :solid_cable_messages do |t|
      t.string :channel_class, null: false
      t.text :channel_parameters
      t.text :channel_identifier, null: false
      t.text :data, null: false
      t.bigint :stream_id, null: false
      t.string :stream_name, null: false
      t.timestamps
    end

    add_index :solid_cable_messages, :stream_name
    add_index :solid_cable_messages, [:channel_identifier, :stream_name], 
              name: "solid_cable_message_compound_primary_key", 
              unique: true

    create_table :solid_cable_processes, if_not_exists: true do |t|
      t.string :process_id, null: false
      t.datetime :last_heartbeat_at, null: false
      t.datetime :created_at, null: false
    end

    add_index :solid_cable_processes, :process_id, unique: true
  end
end
