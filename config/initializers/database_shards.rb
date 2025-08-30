# config/initializers/database_shards.rb
if Rails.env.production?
  config = ActiveRecord::Base.configurations.configs_for(env_name: 'production')
  
  # Set up the primary shard (default)
  primary_config = config.find { |c| c.name == 'primary' }&.configuration_hash
  ActiveRecord::Base.connects_to(shards: { default: { writing: :primary } }) if primary_config
  
  # Set up the cache shard
  cache_config = config.find { |c| c.name == 'cache' }&.configuration_hash
  if cache_config
    ActiveRecord::Base.connects_to(shards: { cache: { writing: :cache } })
  end
  
  # Set up the queue shard
  queue_config = config.find { |c| c.name == 'queue' }&.configuration_hash
  if queue_config
    ActiveRecord::Base.connects_to(shards: { queue: { writing: :queue } })
  end
  
  # Set up the cable shard
  cable_config = config.find { |c| c.name == 'cable' }&.configuration_hash
  if cable_config
    ActiveRecord::Base.connects_to(shards: { cable: { writing: :cable } })
  end
end
