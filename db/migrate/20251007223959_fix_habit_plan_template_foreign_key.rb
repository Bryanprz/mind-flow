class FixHabitPlanTemplateForeignKey < ActiveRecord::Migration[8.0]
  def change
    # Rename the foreign key column in habit_plans table
    rename_column :habit_plans, :healing_plan_template_id, :habit_plan_template_id
    
    # Update the foreign key constraint
    remove_foreign_key :habit_plans, :habit_plan_templates, column: :healing_plan_template_id if foreign_key_exists?(:habit_plans, :habit_plan_templates, column: :healing_plan_template_id)
    add_foreign_key :habit_plans, :habit_plan_templates
  end
end
