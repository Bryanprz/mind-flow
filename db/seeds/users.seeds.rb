# Create a first admin user
admin_user = User.find_or_create_by!(email_address: 'b@b') do |user|
  user.name = 'Bryan Perez'
  user.password = 'asdfasdf'
  user.password_confirmation = 'asdfasdf'
  user.admin = true
end

if admin_user.previously_new_record?
  puts "Created admin user b@b."
else
  puts "Admin user b@b already exists."
end

# Create a second test user
hector = User.find_or_create_by!(email_address: 'h@h') do |user|
  user.name = 'Hector'
  user.password = 'asdfasdf'
  user.password_confirmation = 'asdfasdf'
end

# Set Hector's prakruti to Kapha
kapha_dosha = Dosha.find_by(name: Dosha::KAPHA)
if kapha_dosha
  hector.update(prakruti: kapha_dosha)
  puts "Set Hector's prakruti to Kapha."
else
  puts "Could not find Kapha dosha. Skipping setting Hector's prakruti."
end

# Create a HealingPlan for Hector if he doesn't have one
if hector.healing_plans.empty?
  template = HealingPlanTemplate.find_by(name: "Vata Balancing Plan")

  if template.nil?
    puts "Could not find the 'Vata Balancing Plan' template. Skipping HealingPlan creation for Hector."
  else
    healing_plan = hector.healing_plans.create!(
      description: "Initial constitutional healing plan for Hector.",
      version: 1,
      is_active: true,
      healing_plan_template_id: template.id,
      overview: {
        "focus_area_0" => "Sleep", "goal_0" => "Deeper rest",
        "focus_area_1" => "Digestion", "goal_1" => "Improve Agni",
        "focus_area_2" => "Energy", "goal_2" => "Maintain balance",
        "focus_area_3" => "Emotions", "goal_3" => "Reduce anxiety"
      }
    )

    # Create 7 healing plan logs for the HealingPlan
    journal_entries = [
      "Feeling energetic and focused today. The plan is working well.",
      "A bit tired today, but sticking to the plan. Cravings for sweets were strong.",
      "Slept well and woke up refreshed. My digestion feels much better.",
      "Feeling a little bloated after lunch. Need to be more mindful of my food choices.",
      "Had a great day! Felt balanced and calm throughout.",
      "Struggled with some anxiety today. The breathing exercises helped a lot.",
      "Feeling grateful for this journey. Noticing positive changes in my body and mind."
    ]
    7.times do |i|
      healing_plan.logs.create!(
        date: Date.today - i.days,
        journal_entry: journal_entries[i]
      )
    end
    puts "Created HealingPlan and 7 HealingPlanLogs for Hector."
  end
else
  puts "Hector already has a HealingPlan."
end

# Create a PrakrutiEntry for Hector if he doesn't have one
if hector.prakruti_entry.nil?
  prakruti_assessment = HealthAssessment.find_by(assessment_type: :prakruti)
  if prakruti_assessment.nil?
    puts "Could not find the 'Prakruti Assessment' template. Skipping PrakrutiEntry creation for Hector."
  else
    prakruti_entry = hector.create_prakruti_entry!(
      health_assessment: prakruti_assessment
    )
    # Add some answers to the entry to make it more realistic
    questions = prakruti_assessment.assessment_questions
    questions.each do |question|
      # Pick the third option (Kapha) for each question
      option = question.assessment_options[2]
      prakruti_entry.answers.create!(assessment_option_id: option.id) if option
    end
    puts "Created PrakrutiEntry for Hector and added some answers."
  end
else
  puts "Hector already has a PrakrutiEntry."
end
