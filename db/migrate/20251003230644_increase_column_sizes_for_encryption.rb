class IncreaseColumnSizesForEncryption < ActiveRecord::Migration[8.0]
  def change
    # Increase column sizes for encryption (4x for non-ASCII, +255 bytes overhead)
    # Email addresses: string(255) -> string(510) (+255 bytes overhead)
    change_column :users, :email_address, :string, limit: 510
    
    # Authentication token: string -> string(510) (+255 bytes overhead)  
    change_column :users, :authentication_token, :string, limit: 510
    
    # Results (JSONB) stays as text - no size limit needed for large payloads
    # completed_at stays as datetime - no size change needed
    
    # Note: date_of_birth and time_of_birth stay as date/time types
    # Rails will handle the serialization before encryption
  end
end