class CreateRooms < ActiveRecord::Migration[8.0]
  def change
    create_table :rooms do |t|
      t.string :name, null: false
      t.string :room_type, null: false, default: 'public'
      t.text :description
      t.timestamps
    end
    
    add_index :rooms, :room_type
  end
end
