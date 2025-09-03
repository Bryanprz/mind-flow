class AddDurationTypeToHealingPlanTemplate < ActiveRecord::Migration[8.0]
  def change
    add_column :healing_plan_templates, :duration_type, :integer
  end
end
