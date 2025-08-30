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
        
        # Check if the shard is configured
        config = ActiveRecord::Base.configurations.configs_for(env_name: Rails.env, name: shard_name.to_s)
        
        if config.nil?
          puts "  Warning: No configuration found for #{shard_name} shard. Skipping..."
          next
        end
        
        # Connect to the shard and run migrations
        ActiveRecord::Base.connected_to(role: :writing, shard: shard_name) do
          Rake::Task["db:migrate"].reenable
          Rake::Task["db:migrate"].invoke
        end
        
        puts "  Successfully migrated #{description}"
      rescue => e
        puts "  Error migrating #{description}: #{e.message}"
        raise e if shard_name == :primary  # Fail fast for primary database
      end
    end
    
    puts "All configured databases have been processed."
  end
end
