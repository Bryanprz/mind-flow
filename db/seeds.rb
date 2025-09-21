# First, load the Dosha model to make its constants available
require_relative '../app/models/dosha'

# Then load the dosha seeds
require_relative 'seeds/doshas.seeds.rb'

# Then load other seeds that depend on the Dosha model and its constants
require_relative 'seeds/healing_plan_templates_data.seeds.rb'
require_relative 'seeds/healing_plan_templates.seeds.rb'
require_relative 'seeds/health_assessments.seeds.rb'
require_relative 'seeds/chronic_illnesses.rb'
require_relative 'seeds/dosha_foods_seed.rb'
require_relative 'seeds/dosha_healing_herbs.seeds.rb'
require_relative 'seeds/users.seeds.rb'
require_relative 'seeds/social_posts.rb'

puts "Seeds file has been run."
