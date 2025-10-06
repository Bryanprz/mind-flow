namespace :data do
  desc "Migrate chronic illness descriptions from seeds to ActionText"
  task migrate_chronic_illness_descriptions: :environment do
    puts "Migrating chronic illness descriptions to ActionText..."
    
    # This would be used to migrate data if we had existing data to preserve
    # For now, we'll just ensure the ActionText fields are properly initialized
    
    ChronicIllness.find_each do |chronic_illness|
      # Initialize empty ActionText fields if they don't exist
      chronic_illness.allo_description = "" if chronic_illness.allo_description.blank?
      chronic_illness.ayu_description = "" if chronic_illness.ayu_description.blank?
      chronic_illness.disease_evolution = "" if chronic_illness.disease_evolution.blank?
      chronic_illness.effect_on_doshas = "" if chronic_illness.effect_on_doshas.blank?
      chronic_illness.causative_factors = "" if chronic_illness.causative_factors.blank?
      chronic_illness.manifestation = "" if chronic_illness.manifestation.blank?
      
      chronic_illness.save!
    end
    
    puts "Migration completed successfully!"
  end
end
