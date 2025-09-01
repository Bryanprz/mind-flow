class HealingPlanCreatorService
  def self.call(user)
    HealingPlan.find_or_create_by!(user: user) do |hp|
      hp.name = "Personalized Healing Plan for #{user.name}"
      hp.description = "This is a general healing plan based on your recent Vikruti assessment."
    end
  end
end
