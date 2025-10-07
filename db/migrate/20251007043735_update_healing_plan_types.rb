class UpdateHealingPlanTypes < ActiveRecord::Migration[8.0]
  def up
    # Update all PrakrutiPlan and VikrutiPlan records to be HealingPlan
    # and set the type column to nil since we're disabling STI
    execute "UPDATE healing_plans SET type = NULL WHERE type IN ('PrakrutiPlan', 'VikrutiPlan')"
  end

  def down
    # This migration is not reversible since we deleted the model files
    # If needed, you would need to restore the PrakrutiPlan and VikrutiPlan models first
    raise ActiveRecord::IrreversibleMigration
  end
end
