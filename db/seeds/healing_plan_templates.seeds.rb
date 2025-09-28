# The Dosha model is already loaded by seeds.rb
require_relative 'healing_plan_templates_data.seeds.rb'

# Create doshas if they don't exist
vata = Dosha.find_or_create_by!(name: Dosha::VATA) { |d| d.color = "blue" }
pitta = Dosha.find_or_create_by!(name: Dosha::PITTA) { |d| d.color = "red" }
kapha = Dosha.find_or_create_by!(name: Dosha::KAPHA) { |d| d.color = "green" }

# Create a map of dosha names to their records
dosha_map = {
  Dosha::VATA => vata,
  Dosha::PITTA => pitta,
  Dosha::KAPHA => kapha
}

DOSHA_HEALING_PLANS_TEMPLATE_DATA.each do |dosha_name, plans_data_array| # plans_data_array is now an array of plan configs
  dosha = dosha_map[dosha_name]
  puts "Creating Healing Plan Templates for #{dosha_name}..."

  plans_data_array.each do |data| # Loop through each plan config (daily, 3month, 6month)
    name = "#{dosha_name} Balancing Plan"
    
    # Find or create the template with all required attributes - include duration_type to make it unique
    healing_plan_template = HealingPlanTemplate.find_or_initialize_by(
      name: name,
      duration_type: data[:duration_type],
      dosha: dosha
    )
    healing_plan_template.assign_attributes(
      description: data[:description]
    )
    healing_plan_template.save!

    # ... rest of the section and item seeding logic remains the same ...
    data[:sections].each_with_index do |section_data, section_index|
      section_template = healing_plan_template.plan_section_templates.find_or_initialize_by(
        name: section_data[:name]
      )
      section_template.position = section_index + 1
      section_template.save!

      section_data[:items].each_with_index do |item_content, item_index|
        item_template = section_template.plan_item_templates.find_or_initialize_by(
          content: item_content
        )
        item_template.position = item_index + 1
        item_template.save!
      end
    end
  end
end

puts "Healing Plan Templates seeded successfully!"
