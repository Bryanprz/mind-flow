require_relative 'healing_plan_templates_data.seeds.rb'

# Seed Dosha records if they don't exist (assuming they are already seeded elsewhere or will be)
# For this seed, we'll find_or_create_by name
vata_dosha = Dosha.find_or_initialize_by(name: "Vata")
vata_dosha.color = "blue"
vata_dosha.save!

pitta_dosha = Dosha.find_or_initialize_by(name: "Pitta")
pitta_dosha.color = "red"
pitta_dosha.save!

kapha_dosha = Dosha.find_or_initialize_by(name: "Kapha")
kapha_dosha.color = "green"
kapha_dosha.save!

dosha_map = {
  "Vata" => vata_dosha,
  "Pitta" => pitta_dosha,
  "Kapha" => kapha_dosha
}

DOSHA_HEALING_PLANS_TEMPLATE_DATA.each do |dosha_name, plans_data_array| # plans_data_array is now an array of plan configs
  dosha = dosha_map[dosha_name]
  puts "Creating Healing Plan Templates for #{dosha_name}..."

  plans_data_array.each do |data| # Loop through each plan config (daily, 3month, 6month)
    healing_plan_template = HealingPlanTemplate.find_or_initialize_by(
      name: "#{dosha_name} Balancing Plan - #{data[:duration_type].titleize}" # Adjust name for clarity
    )
    healing_plan_template.description = data[:description]
    healing_plan_template.dosha = dosha
    healing_plan_template.duration_type = data[:duration_type]
    healing_plan_template.save!

    # ... rest of the section and item seeding logic remains the same ...
    data[:sections].each_with_index do |section_data, section_index|
      section_template = healing_plan_template.plan_section_templates.find_or_initialize_by(
        name: section_data[:name]
      )
      section_template.ordering = section_index + 1
      section_template.save!

      section_data[:items].each_with_index do |item_content, item_index|
        item_template = section_template.plan_item_templates.find_or_initialize_by(
          content: item_content
        )
        item_template.ordering = item_index + 1
        item_template.save!
      end
    end
  end
end

puts "Healing Plan Templates seeded successfully!"
