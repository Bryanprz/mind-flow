class ForceEncryptExistingData < ActiveRecord::Migration[8.0]
  def up
    # This migration forces encryption of existing unencrypted data
    # Using the explicit encrypt method from Rails 8.0 API
    
    puts "Force encrypting existing user data..."
    User.find_each do |user|
      puts "Processing user ID: #{user.id}, email: #{user.email_address.inspect}"
      begin
        # Skip users that already have corrupted encrypted data
        if user.email_address.to_s.start_with?('{"p":')
          puts "  ⏭️  Skipping user #{user.id} - already has encrypted data"
          next
        end
        
        # Force encryption of all encrypted attributes
        user.encrypt
        user.save!
        puts "  ✅ Successfully encrypted user #{user.id}"
      rescue => e
        puts "  ❌ Failed to encrypt user #{user.id}: #{e.message}"
        # Skip this user and continue with others
      end
    end
    
    puts "Force encrypting existing assessment entry data..."
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
    
    puts "Force encryption migration completed!"
  end
  
  def down
    raise ActiveRecord::IrreversibleMigration, "Cannot reverse encryption - data would be lost"
  end
end