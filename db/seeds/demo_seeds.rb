# Demo seeds for MindMetrics - sanitized wellness tracking app

puts "🌱 Creating demo data for MindMetrics..."

# Create demo users
demo_users = [
  {
    name: "Sarah Johnson",
    email_address: "sarah@demo.com",
    password: "demo123",
    password_confirmation: "demo123",
    bio: "Wellness enthusiast passionate about meditation and sleep optimization",
    location: "San Francisco, CA",
    handle: "sarah_wellness"
  },
  {
    name: "Mike Chen",
    email_address: "mike@demo.com", 
    password: "demo123",
    password_confirmation: "demo123",
    bio: "Health coach focused on sustainable habit building",
    location: "Austin, TX",
    handle: "mike_health"
  },
  {
    name: "Emma Rodriguez",
    email_address: "emma@demo.com",
    password: "demo123", 
    password_confirmation: "demo123",
    bio: "Yoga instructor and mindfulness practitioner",
    location: "Portland, OR",
    handle: "emma_balance"
  }
]

created_users = []
demo_users.each do |user_attrs|
  user = User.find_or_create_by(email_address: user_attrs[:email_address]) do |u|
    u.assign_attributes(user_attrs)
  end
  created_users << user
  puts "✅ Created user: #{user.name}"
end

# Seed sample goals for demo users
puts "🎯 Seeding goals..."

created_users.each do |user|
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
  
  puts "✅ Created goals for #{user.name}"
end

puts "🎉 Demo data creation complete!"
puts "Created #{created_users.count} users with sample goals"
puts "Demo users can log in with email: sarah@demo.com, mike@demo.com, or emma@demo.com and password: demo123"


