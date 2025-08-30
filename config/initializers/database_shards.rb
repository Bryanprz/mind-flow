# config/initializers/database_shards.rb
Rails.application.reloader.to_prepare do
  configs = ActiveRecord::Base.configurations.configs_for(env_name: Rails.env)
  
  # Set up the primary shard (default)
  if (primary_config = configs.find { |c| c.name == 'primary' })
    ActiveRecord::Base.connects_to(shards: { default: { writing: :primary } })
  end
  
  # Set up the cache shard
  if (cache_config = configs.find { |c| c.name == 'cache' })
    ActiveRecord::Base.connects_to(shards: { cache: { writing: :cache } })
  end
  
  # Set up the queue shard
  if (queue_config = configs.find { |c| c.name == 'queue' })
    ActiveRecord::Base.connects_to(shards: { queue: { writing: :queue } })
  end
  
  # Set up the cable shard
  if (cable_config = configs.find { |c| c.name == 'cable' })
    ActiveRecord::Base.connects_to(shards: { cable: { writing: :cable } })
  end
end
