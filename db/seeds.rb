# Create a first admin user
if User.find_by(email_address: 'b@b').nil?
  User.create!(
    name: 'Bryan Perez',
    email_address: 'b@b',
    password: 'asdfasdf',
    password_confirmation: 'asdfasdf',
    admin: true
  )
end
 
require_relative 'seeds/healing_plan_templates.seeds.rb'
require_relative 'seeds/disease_stages.seeds.rb'
require_relative 'seeds/doshas.seeds.rb'
require_relative 'seeds/health_assessments.seeds.rb'
require_relative 'seeds/chronic_illnesses.rb'

puts "Seeds file has been run."
