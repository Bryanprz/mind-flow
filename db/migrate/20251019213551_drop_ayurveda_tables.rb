class DropAyurvedaTables < ActiveRecord::Migration[8.0]
  def up
    # Drop bio profile tables
    drop_table :bio_profile_supplements, if_exists: true
    drop_table :bio_profile_aggravating_foods, if_exists: true
    drop_table :bio_profile_healing_foods, if_exists: true
    drop_table :bio_profiles, if_exists: true
    
    # Drop assessment tables
    drop_table :assessment_answers, if_exists: true
    drop_table :assessment_options, if_exists: true
    drop_table :assessment_questions, if_exists: true
    drop_table :assessment_entries, if_exists: true
    drop_table :health_assessments, if_exists: true
    
    # Drop old template table (renamed to habit_plan_templates)
    drop_table :healing_plan_templates, if_exists: true
    
    # Drop lifestyle plans
    drop_table :lifestyle_plans, if_exists: true
  end

  def down
    raise ActiveRecord::IrreversibleMigration, "Cannot recreate dropped Ayurveda tables"
  end
end
