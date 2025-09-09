class PrakrutiPlan < HealingPlan
  validate :user_has_only_one_per_duration_type, on: :create

  private

  def user_has_only_one_per_duration_type
    # Check if a PrakrutiPlan with the same duration_type already exists for this user
    # Exclude the current record if it's an update (though validation is on :create)
    if user.prakruti_plans.exists?(duration_type: self.duration_type)
      errors.add(:duration_type, "already has a Prakruti plan for this duration type")
    end
  end
end
