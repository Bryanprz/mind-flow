# The BioProfile model is already loaded by seeds.rb
require_relative 'healing_plan_templates_data.seeds.rb'

# Create bio profiles if they don't exist
nervous_system = BioProfile.find_or_create_by!(name: BioProfile::NERVOUS_SYSTEM) { |d| d.color = "blue" }
metabolic = BioProfile.find_or_create_by!(name: BioProfile::METABOLIC) { |d| d.color = "red" }
structural = BioProfile.find_or_create_by!(name: BioProfile::STRUCTURAL) { |d| d.color = "green" }

# Create a map of bio profile names to their records
bio_profile_map = {
  BioProfile::NERVOUS_SYSTEM => nervous_system,
  BioProfile::METABOLIC => metabolic,
  BioProfile::STRUCTURAL => structural
}

BIO_PROFILE_PLANS_TEMPLATE_DATA.each do |bio_profile_name, plans_data_array| # plans_data_array is now an array of plan configs
  bio_profile = bio_profile_map[bio_profile_name]
  puts "Creating Healing Plan Templates for #{bio_profile_name}..."

  plans_data_array.each do |data| # Loop through each plan config (daily, 3month, 6month)
    name = "#{bio_profile_name} Optimization Plan"
    
    # Find or create the template with all required attributes - include duration_type to make it unique
    healing_plan_template = HealingPlanTemplate.find_or_initialize_by(
      name: name,
      duration_type: data[:duration_type],
      healing_focus: bio_profile
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
