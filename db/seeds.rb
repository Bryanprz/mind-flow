# Load demo seeds for MindMetrics (sanitized wellness tracking app)
require_relative 'seeds/demo_seeds.rb'

# Load bio profile seeds
require_relative 'seeds/bio_profiles.seeds.rb'
# require_relative 'seeds/bio_profile_foods.seeds.rb'  # Commented out - uses different Food model approach
require_relative 'seeds/bio_profile_foods_seed.rb'
require_relative 'seeds/bio_profile_supplements.seeds.rb'
require_relative 'seeds/healing_plan_templates.seeds.rb'

puts "🌱 MindMetrics demo seeds completed successfully!"
