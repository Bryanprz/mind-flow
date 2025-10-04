class ChangeDoshaToHealingFocusInHealingPlanTemplates < ActiveRecord::Migration[8.0]
  def up
    # Add the new polymorphic columns
    add_reference :healing_plan_templates, :healing_focus, polymorphic: true, index: true
    
    # Migrate existing dosha data to the new polymorphic structure
    execute <<-SQL
      UPDATE healing_plan_templates 
      SET healing_focus_type = 'Dosha', healing_focus_id = dosha_id 
      WHERE dosha_id IS NOT NULL
    SQL
    
    # Remove the old dosha column
    remove_reference :healing_plan_templates, :dosha
  end

  def down
    # Add back the dosha column
    add_reference :healing_plan_templates, :dosha, foreign_key: true
    
    # Migrate data back (only for Dosha type)
    execute <<-SQL
      UPDATE healing_plan_templates 
      SET dosha_id = healing_focus_id 
      WHERE healing_focus_type = 'Dosha'
    SQL
    
    # Remove the polymorphic columns
    remove_reference :healing_plan_templates, :healing_focus, polymorphic: true
  end
end
