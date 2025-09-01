class AddHealingPlanTemplateRefToHealingPlans < ActiveRecord::Migration[8.0]
  def change
    add_reference :healing_plans, :healing_plan_template, null: true, foreign_key: true
  end
end
