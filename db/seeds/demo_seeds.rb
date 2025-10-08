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

# Create habit plan templates
habit_templates = [
  {
    name: "Daily Wellness Routine",
    description: "A comprehensive daily routine focusing on sleep, meditation, and physical activity",
    duration_type: "daily"
  },
  {
    name: "Sleep Optimization Plan", 
    description: "Track and improve sleep quality with consistent bedtime routines",
    duration_type: "daily"
  },
  {
    name: "Meditation Practice",
    description: "Build a consistent meditation practice with progressive techniques",
    duration_type: "three_month"
  }
]

created_templates = []
habit_templates.each do |template_attrs|
  template = HabitPlanTemplate.find_or_create_by(name: template_attrs[:name]) do |t|
    t.assign_attributes(template_attrs)
  end
  created_templates << template
  puts "✅ Created habit template: #{template.name}"
end

# Create plan sections and items for the Daily Wellness Routine
daily_template = created_templates.find { |t| t.name == "Daily Wellness Routine" }
if daily_template
  sections_data = [
    {
      name: "Morning Routine",
      position: 1,
      items: [
        "Wake up at consistent time (within 30 minutes)",
        "Drink a glass of water immediately",
        "5 minutes of deep breathing",
        "Write down 3 things you're grateful for"
      ]
    },
    {
      name: "Evening Routine", 
      position: 2,
      items: [
        "Stop screens 1 hour before bed",
        "Light stretching or gentle yoga",
        "Prepare for tomorrow",
        "Reflect on the day in journal"
      ]
    },
    {
      name: "Wellness Tracking",
      position: 3,
      items: [
        "Log sleep quality (1-10 scale)",
        "Track mood throughout day",
        "Note any stress triggers",
        "Record water intake (glasses)"
      ]
    }
  ]
  
  sections_data.each do |section_data|
    section = daily_template.plan_section_templates.find_or_create_by(name: section_data[:name]) do |s|
      s.position = section_data[:position]
    end
    
    section_data[:items].each_with_index do |item_content, index|
      section.plan_item_templates.find_or_create_by(content: item_content) do |item|
        item.position = index + 1
      end
    end
  end
  puts "✅ Created plan sections and items for Daily Wellness Routine"
end

# Create habit plans for demo users
created_users.each_with_index do |user, index|
  template = created_templates[index % created_templates.length]
  
  habit_plan = user.habit_plans.find_or_create_by(habit_plan_template: template) do |plan|
    plan.name = template.name
    plan.description = template.description
    plan.duration_type = template.duration_type
    plan.is_active = true
    plan.version = 1
  end
  
  # Create some sample habit logs for the past 7 days
  (7.days.ago.to_date..Date.current).each do |date|
    log = habit_plan.logs.find_or_create_by(date: date)
    
    # Randomly complete some items to show progress
    if rand > 0.3 # 70% chance of completion
      log.update!(
        completed_at: date.beginning_of_day + rand(8..20).hours,
        journal_entry: [
          "Great day! Feeling energized and focused.",
          "Struggled with morning routine but evening went well.",
          "Consistent sleep schedule is paying off.",
          "Meditation session was particularly calming today.",
          "Had some stress but used breathing techniques effectively."
        ].sample
      )
    end
  end
  
  puts "✅ Created habit plan for #{user.name} with 7 days of sample logs"
end

# Create some assessment entries to show wellness tracking
assessment_types = ["wellness_profile", "stress_assessment", "sleep_quality"]
created_users.each do |user|
  assessment_type = assessment_types.sample
  entry = user.assessment_entries.find_or_create_by(
    health_assessment: HealthAssessment.find_or_create_by(
      name: assessment_type.humanize,
      description: "Track your #{assessment_type.humanize.downcase}",
      assessment_type: assessment_type
    )
  ) do |e|
    e.completed_at = rand(1..30).days.ago
    e.notes = [
      "Feeling more balanced with daily routine",
      "Sleep quality has improved significantly", 
      "Stress levels are manageable with current practices",
      "Overall wellness score trending upward"
    ].sample
  end
  puts "✅ Created assessment entry for #{user.name}"
end

puts "🎉 Demo data creation complete!"
puts "Created #{created_users.count} users, #{created_templates.count} habit templates, and sample habit logs"
puts "Demo users can log in with email: demo@example.com and password: demo123"

