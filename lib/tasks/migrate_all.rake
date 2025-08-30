namespace :db do
  desc "Migrate all databases (main, cache, queue, cable)"
  task migrate_all: :environment do
    puts "Migrating primary database..."
    ActiveRecord::Base.connected_to(role: :writing, shard: :default) do
      Rake::Task["db:migrate"].invoke
    end

    puts "Migrating cache database..."
    ActiveRecord::Base.connected_to(role: :writing, shard: :cache) do
      Rake::Task["db:migrate"].reenable
      Rake::Task["db:migrate"].invoke
    end

    puts "Migrating queue database..."
    ActiveRecord::Base.connected_to(role: :writing, shard: :queue) do
      Rake::Task["db:migrate"].reenable
      Rake::Task["db:migrate"].invoke
    end

    puts "Migrating cable database..."
    ActiveRecord::Base.connected_to(role: :writing, shard: :cable) do
      Rake::Task["db:migrate"].reenable
      Rake::Task["db:migrate"].invoke
    end

    puts "All databases migrated successfully!"
  end
end
