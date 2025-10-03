class EncryptExistingData < ActiveRecord::Migration[8.0]
  def up
    # This migration encrypts existing unencrypted data
    # Rails 8.0 will automatically handle the encryption when we save records
    
    puts "Encrypting existing user data..."
    User.find_each do |user|
      puts "Processing user ID: #{user.id}, email: #{user.email_address.inspect}"
      begin
        # Force encryption of all encrypted attributes
        # Use the explicit encrypt method to force encryption of unencrypted data
        user.encrypt
        user.save!
        puts "  ✅ Successfully encrypted user #{user.id}"
      rescue => e
        puts "  ❌ Failed to encrypt user #{user.id}: #{e.message}"
        # Skip this user and continue with others
      end
    end
    
    puts "Encrypting existing assessment entry data..."
    AssessmentEntry.find_each do |entry|
      begin
        # Force encryption of all encrypted attributes
        entry.encrypt
        entry.save!
        puts "  ✅ Successfully encrypted assessment entry #{entry.id}"
      rescue => e
        puts "  ❌ Failed to encrypt assessment entry #{entry.id}: #{e.message}"
        # Skip this entry and continue with others
      end
    end
    
    puts "Data encryption migration completed!"
  end
  
  def down
    raise ActiveRecord::IrreversibleMigration, "Cannot reverse encryption - data would be lost"
  end
end