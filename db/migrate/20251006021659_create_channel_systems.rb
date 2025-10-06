class CreateChannelSystems < ActiveRecord::Migration[8.0]
  def change
    create_table :channel_systems do |t|
      t.string :name
      t.text :description
      t.references :revived_by, polymorphic: true, null: false
      t.references :damaged_by, polymorphic: true, null: false

      t.timestamps
    end
  end
end
