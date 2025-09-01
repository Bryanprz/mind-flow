class HealingProtocolManager
  def initialize(user, health_assessment)
    @user = user
    @health_assessment = health_assessment
  end

  def determine_and_apply_protocol
    template = determine_template_for_user

    unless template
      Rails.logger.warn "Could not determine healing plan template for user #{user.id}"
      return
    end

    case health_assessment.assessment_type.to_sym
    when :prakruti
      PrakrutiPlan.create(user: user, healing_plan_template: template)
    when :vikruti
      VikrutiPlan.create(user: user, healing_plan_template: template)
    end
  end

  private

  def determine_template_for_user
    case health_assessment.assessment_type.to_sym
    when :prakruti
      HealingPlanTemplate.find_by(dosha: @user.prakruti)
    when :vikruti
      HealingPlanTemplate.find_by(dosha: @user.vikruti)
    else
      nil # Or you could raise an error for an unknown assessment type
    end
  end

  attr_reader :user, :health_assessment
end
