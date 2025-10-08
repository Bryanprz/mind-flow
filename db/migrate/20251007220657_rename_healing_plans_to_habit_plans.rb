class RenameHealingPlansToHabitPlans < ActiveRecord::Migration[8.0]
  def change
    # Rename tables
    rename_table :healing_plans, :habit_plans
    rename_table :healing_plan_logs, :habit_logs
    rename_table :healing_plan_templates, :habit_plan_templates
    
    # Rename foreign key columns
    rename_column :plan_sections, :healing_plan_id, :habit_plan_id
    # plan_item_templates already has the correct column name
    rename_column :plan_section_templates, :healing_plan_template_id, :habit_plan_template_id
    rename_column :habit_logs, :healing_plan_id, :habit_plan_id
    
    # Update foreign key constraints
    remove_foreign_key :habit_logs, :healing_plans if foreign_key_exists?(:habit_logs, :healing_plans)
    remove_foreign_key :plan_sections, :healing_plans if foreign_key_exists?(:plan_sections, :healing_plans)
    remove_foreign_key :plan_section_templates, :healing_plan_templates if foreign_key_exists?(:plan_section_templates, :healing_plan_templates)
    
    add_foreign_key :habit_logs, :habit_plans
    add_foreign_key :plan_sections, :habit_plans
    add_foreign_key :plan_section_templates, :habit_plan_templates
  end
end
