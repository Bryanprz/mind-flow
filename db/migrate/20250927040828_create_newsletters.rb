class CreateNewsletters < ActiveRecord::Migration[8.0]
  def change
    create_table :newsletters do |t|
      t.string :email_address, null: false
      t.string :status, default: 'subscribed'
      t.boolean :active, default: true
      t.datetime :subscribed_at, default: -> { 'CURRENT_TIMESTAMP' }

      t.timestamps
    end
    add_index :newsletters, :email_address, unique: true
  end
end
