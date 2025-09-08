# Create a first admin user
if User.find_by(email_address: 'b@b').nil?
  User.create!(
    name: 'Bryan Perez',
    email_address: 'b@b',
    password: 'asdfasdf',
    password_confirmation: 'asdfasdf',
    admin: true
  )
  puts "Created admin user b@b."
end

# Create a second test user
hector = User.find_or_create_by!(email_address: 'h@h') do |user|
  user.name = 'Hector'
  user.password = 'asdfasdf'
  user.password_confirmation = 'asdfasdf'
end

# Set Hector's prakruti
vata_dosha = Dosha.find_by(name: Dosha::VATA)
if vata_dosha
  hector.update(prakruti: vata_dosha)
  puts "Set Hector's prakruti to Vata."
else
  puts "Could not find Vata dosha. Skipping setting Hector's prakruti."
end

# Create a PrakrutiPlan for Hector if he doesn't have one
if hector.prakruti_plans.empty?
  template = HealingPlanTemplate.find_by(name: "Vata Balancing Plan - Daily")

  if template.nil?
    puts "Could not find the 'Vata Balancing Plan - Daily' template. Skipping PrakrutiPlan creation for Hector."
  else
    prakruti_plan = hector.prakruti_plans.create!(
      description: "Initial constitutional healing plan for Hector.",
      version: 1,
      is_active: true,
      healing_plan_template_id: template.id
    )

    # Create 5 healing plan logs for the PrakrutiPlan
    5.times do |i|
      prakruti_plan.healing_plan_logs.create!(
        date: Date.today - i.days,
        journal_entry: "Log entry for day #{i + 1}."
      )
    end
    puts "Created PrakrutiPlan and 5 HealingPlanLogs for Hector."
  end
else
  puts "Hector already has a PrakrutiPlan."
end

# Create 4 VikrutiPlans for Hector
if hector.vikruti_plans.count < 4
  vikruti_templates = [
    "Pitta Balancing Plan - Daily",
    "Kapha Balancing Plan - Daily",
    "Vata Balancing Plan - Three Month",
    "Pitta Balancing Plan - Three Month"
  ]

  vikruti_templates.each do |template_name|
    template = HealingPlanTemplate.find_by(name: template_name)
    if template
      hector.vikruti_plans.create!(
        healing_plan_template_id: template.id,
        description: "A Vikruti plan based on #{template_name}",
        version: 1,
        is_active: false
      )
      puts "Created VikrutiPlan for Hector based on #{template_name}"
    else
      puts "Could not find template #{template_name}. Skipping VikrutiPlan creation."
    end
  end
end


# Create a PrakrutiEntry for Hector if he doesn't have one
if hector.prakruti_entry.nil?
  prakruti_assessment = HealthAssessment.find_by(assessment_type: :prakruti)
  if prakruti_assessment.nil?
    puts "Could not find the 'Prakruti Assessment' template. Skipping PrakrutiEntry creation for Hector."
  else
    hector.create_prakruti_entry!(
      health_assessment: prakruti_assessment
    )
    puts "Created PrakrutiEntry for Hector."
  end
else
  puts "Hector already has a PrakrutiEntry."
end
