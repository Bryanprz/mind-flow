class AddMissingColumnsToSolidCableMessages < ActiveRecord::Migration[8.0]
  def change
    add_column :solid_cable_messages, :channel_hash, :string, null: false
    add_column :solid_cable_messages, :channel, :string, null: false
    add_column :solid_cable_messages, :metadata, :text, default: '{}'
    
    add_index :solid_cable_messages, :channel_hash
  end
end
