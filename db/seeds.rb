# Load demo seeds for MindFlow
require_relative 'seeds/demo_seeds.rb'

# Seed sample goals for demo users
puts "🎯 Seeding goals..."

User.find_each do |user|
  next if user.goals.any? # Skip if already has goals
  
  user.goals.create!([
    {
      title: "Master Flow State",
      description: "Achieve consistent flow state during focus sessions",
      progress: rand(30..80),
      target: 100,
      deadline: rand(1..3).months.from_now,
      category: "Focus & Concentration",
      icon: "🎯",
      status: :active
    },
    {
      title: "Daily Meditation Practice",
      description: "Meditate every day for 30 days straight",
      progress: rand(10..25),
      target: 30,
      deadline: 1.month.from_now,
      category: "Meditation Practice",
      icon: "🧘",
      status: :active
    },
    {
      title: "Improve Cognitive Performance",
      description: "Complete all daily habit tracking consistently",
      progress: rand(20..60),
      target: 100,
      deadline: 2.months.from_now,
      category: "Mental Training",
      icon: "🧠",
      status: :active
    }
  ])
  
  # Add some completed goals
  if rand > 0.5
    user.goals.create!([
      {
        title: "Establish Morning Routine",
        description: "Build a consistent morning meditation practice",
        progress: 100,
        target: 100,
        deadline: 1.week.ago,
        category: "Wellness & Balance",
        icon: "☀️",
        status: :completed
      }
    ])
  end
end

puts "✅ Goals seeded for all users"
puts "🌱 MindFlow demo seeds completed successfully!"
