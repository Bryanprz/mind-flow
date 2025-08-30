namespace :db do
  desc "Migrate all databases (main, cache, queue, cable)"
  task migrate_all: :environment do
    shards = {
      primary: "primary database",
      cache: "cache database",
      queue: "queue database",
      cable: "cable database"
    }

    shards.each do |shard_name, description|
      begin
        puts "Migrating #{description}..."
        
        # Check if the shard is configured in database.yml
        configs = ActiveRecord::Base.configurations.configs_for(env_name: Rails.env)
        config = configs.find { |c| c.name == shard_name.to_s }
        
        if config.nil?
          puts "  Warning: No configuration found for #{shard_name} shard in database.yml. Skipping..."
          next
        end
        
        # Verify the connection can be established
        begin
          ActiveRecord::Base.establish_connection(config.configuration_hash)
          ActiveRecord::Base.connection.execute("SELECT 1")
        rescue => e
          puts "  Warning: Could not connect to #{shard_name} shard: #{e.message}"
          next
        end
        
        # Connect to the shard and run migrations
        ActiveRecord::Base.connected_to(role: :writing, shard: shard_name) do
          begin
            Rake::Task["db:migrate"].reenable
            Rake::Task["db:migrate"].invoke
            puts "  Successfully migrated #{description}"
          rescue => e
            puts "  Error running migrations on #{description}: #{e.message}"
            raise if shard_name == :primary  # Fail fast for primary database
          end
        end
        
      rescue => e
        puts "  Error processing #{description}: #{e.message}"
        raise if shard_name == :primary  # Fail fast for primary database
      end
    end
    
    puts "All configured databases have been processed."
  end
end
