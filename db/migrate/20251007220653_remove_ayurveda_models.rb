class RemoveAyurvedaModels < ActiveRecord::Migration[8.0]
  def up
    # Remove foreign key constraints first
    remove_foreign_key :users, :doshas, column: :prakruti_id if foreign_key_exists?(:users, :doshas, column: :prakruti_id)
    remove_foreign_key :users, :doshas, column: :vikruti_id if foreign_key_exists?(:users, :doshas, column: :vikruti_id)
    
    # Remove columns from users table
    remove_column :users, :prakruti_id, :bigint
    remove_column :users, :vikruti_id, :bigint
    remove_column :users, :time_of_birth, :time
    remove_column :users, :date_of_birth, :date
    
    # Remove foreign key constraints from other tables before dropping
    remove_foreign_key :chronic_illness_affected_dhatus, :chronic_illnesses if foreign_key_exists?(:chronic_illness_affected_dhatus, :chronic_illnesses)
    remove_foreign_key :chronic_illness_affected_dhatus, :dhatus if foreign_key_exists?(:chronic_illness_affected_dhatus, :dhatus)
    remove_foreign_key :chronic_illness_aggravating_foods, :chronic_illnesses if foreign_key_exists?(:chronic_illness_aggravating_foods, :chronic_illnesses)
    remove_foreign_key :chronic_illness_aggravating_foods, :foods if foreign_key_exists?(:chronic_illness_aggravating_foods, :foods)
    remove_foreign_key :chronic_illness_channel_systems, :chronic_illnesses if foreign_key_exists?(:chronic_illness_channel_systems, :chronic_illnesses)
    remove_foreign_key :chronic_illness_channel_systems, :channel_systems if foreign_key_exists?(:chronic_illness_channel_systems, :channel_systems)
    remove_foreign_key :chronic_illness_healing_foods, :chronic_illnesses if foreign_key_exists?(:chronic_illness_healing_foods, :chronic_illnesses)
    remove_foreign_key :chronic_illness_healing_foods, :foods if foreign_key_exists?(:chronic_illness_healing_foods, :foods)
    remove_foreign_key :dosha_aggravating_foods, :doshas if foreign_key_exists?(:dosha_aggravating_foods, :doshas)
    remove_foreign_key :dosha_aggravating_foods, :foods if foreign_key_exists?(:dosha_aggravating_foods, :foods)
    remove_foreign_key :dosha_healing_foods, :doshas if foreign_key_exists?(:dosha_healing_foods, :doshas)
    remove_foreign_key :dosha_healing_foods, :foods if foreign_key_exists?(:dosha_healing_foods, :foods)
    remove_foreign_key :dosha_healing_herbs, :doshas if foreign_key_exists?(:dosha_healing_herbs, :doshas)
    remove_foreign_key :assessment_chronic_illnesses, :assessment_entries if foreign_key_exists?(:assessment_chronic_illnesses, :assessment_entries)
    remove_foreign_key :assessment_chronic_illnesses, :chronic_illnesses if foreign_key_exists?(:assessment_chronic_illnesses, :chronic_illnesses)
    
    # Drop Ayurveda-specific tables
    drop_table :dosha_aggravating_foods if table_exists?(:dosha_aggravating_foods)
    drop_table :dosha_healing_foods if table_exists?(:dosha_healing_foods)
    drop_table :dosha_healing_herbs if table_exists?(:dosha_healing_herbs)
    drop_table :doshas if table_exists?(:doshas)
    drop_table :foods if table_exists?(:foods)
    drop_table :cures if table_exists?(:cures)
    drop_table :books if table_exists?(:books)
    drop_table :verses if table_exists?(:verses)
    drop_table :dhatus if table_exists?(:dhatus)
    drop_table :channel_systems if table_exists?(:channel_systems)
    drop_table :chronic_illnesses if table_exists?(:chronic_illnesses)
    drop_table :chronic_illness_affected_dhatus if table_exists?(:chronic_illness_affected_dhatus)
    drop_table :chronic_illness_aggravating_foods if table_exists?(:chronic_illness_aggravating_foods)
    drop_table :chronic_illness_channel_systems if table_exists?(:chronic_illness_channel_systems)
    drop_table :chronic_illness_healing_foods if table_exists?(:chronic_illness_healing_foods)
    drop_table :disease_stages if table_exists?(:disease_stages)
    
    # Drop assessment-related Ayurveda tables
    drop_table :assessment_chronic_illnesses if table_exists?(:assessment_chronic_illnesses)
    drop_table :prakruti_entries if table_exists?(:prakruti_entries)
    drop_table :vikruti_entries if table_exists?(:vikruti_entries)
    
    # Remove dosha-related columns from assessment tables
    remove_column :assessment_options, :dosha if column_exists?(:assessment_options, :dosha)
    
    # Drop messaging and social tables (client-side only in demo)
    drop_table :social_post_bookmarks if table_exists?(:social_post_bookmarks)
    drop_table :likes if table_exists?(:likes)
    drop_table :messages if table_exists?(:messages)
    drop_table :memberships if table_exists?(:memberships)
    drop_table :rooms if table_exists?(:rooms)
    drop_table :social_posts if table_exists?(:social_posts)
  end
  
  def down
    # This migration is not reversible
    raise ActiveRecord::IrreversibleMigration
  end
end
