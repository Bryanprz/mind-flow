class AddUniqueIndexToMessagesId < ActiveRecord::Migration[8.0]
  def change
    # Add unique index to messages.id to fix "No unique index found for id" error
    # This is needed for proper ActionCable serialization
    add_index :messages, :id, unique: true, name: 'index_messages_on_id', if_not_exists: true
  end
end
