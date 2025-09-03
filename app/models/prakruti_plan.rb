class PrakrutiPlan < HealingPlan
  validate :user_has_only_one, on: :create

  private

  def user_has_only_one
    if user.prakruti_plans.any?
      errors.add(:user_id, "already has a Prakruti plan")
    end
  end
end
