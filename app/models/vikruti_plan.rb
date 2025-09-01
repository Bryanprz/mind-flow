class VikrutiPlan < HealingPlan
  after_create :deactivate_other_plans

  private

  def deactivate_other_plans
    user.healing_plans.where.not(id: self.id).update_all(is_active: false)
  end
end
