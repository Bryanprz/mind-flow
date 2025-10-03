class RemoveIncorrectEncryptionColumns < ActiveRecord::Migration[8.0]
  def change
    # Remove the incorrectly added encryption columns
    remove_column :users, :email_address_ciphertext, :text
    remove_column :users, :email_address_bidx, :string
    remove_column :users, :date_of_birth_ciphertext, :text
    remove_column :users, :date_of_birth_bidx, :string
    remove_column :users, :time_of_birth_ciphertext, :text
    remove_column :users, :time_of_birth_bidx, :string
    remove_column :users, :authentication_token_ciphertext, :text
    remove_column :users, :authentication_token_bidx, :string
    
    remove_column :assessment_entries, :results_ciphertext, :text
    remove_column :assessment_entries, :results_bidx, :string
    remove_column :assessment_entries, :completed_at_ciphertext, :text
    remove_column :assessment_entries, :completed_at_bidx, :string
  end
end