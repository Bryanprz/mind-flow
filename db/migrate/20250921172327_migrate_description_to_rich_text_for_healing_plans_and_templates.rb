class MigrateDescriptionToRichTextForHealingPlansAndTemplates < ActiveRecord::Migration[8.0]
  def change
    remove_column :healing_plans, :description, :text
    remove_column :healing_plan_templates, :description, :text
  end
end