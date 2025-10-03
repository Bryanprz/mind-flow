class AddEncryptionColumns < ActiveRecord::Migration[8.0]
  def change
    # Add encrypted columns for users (keeping original columns)
    add_column :users, :email_address_ciphertext, :text
    add_column :users, :email_address_bidx, :string
    add_column :users, :date_of_birth_ciphertext, :text
    add_column :users, :date_of_birth_bidx, :string
    add_column :users, :time_of_birth_ciphertext, :text
    add_column :users, :time_of_birth_bidx, :string
    add_column :users, :authentication_token_ciphertext, :text
    add_column :users, :authentication_token_bidx, :string
    
    # Add encrypted columns for assessment_entries
    add_column :assessment_entries, :results_ciphertext, :text
    add_column :assessment_entries, :results_bidx, :string
    add_column :assessment_entries, :completed_at_ciphertext, :text
    add_column :assessment_entries, :completed_at_bidx, :string
    
    # Add indexes for encrypted fields that need to be searchable
    add_index :users, :email_address_bidx, unique: true
    add_index :users, :authentication_token_bidx, unique: true
    add_index :assessment_entries, :completed_at_bidx
  end
end