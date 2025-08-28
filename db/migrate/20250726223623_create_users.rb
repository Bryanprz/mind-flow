class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :email_address, null: false
      t.string :first_name
      t.string :last_name
      t.string :password_digest, null: false
      t.date :date_of_birth
      t.time :time_of_birth
      t.bigint :prakruti_id
      t.bigint :vikruti_id
      t.string :authentication_token
      t.timestamps
      t.index :email_address, unique: true
      t.index :authentication_token
      t.index :prakruti_id
      t.index :vikruti_id
    end
  end
end
