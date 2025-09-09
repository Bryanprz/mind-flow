class CreateHealingPlan
  def initialize(user, health_assessment)
    @user = user
    @health_assessment = health_assessment
    @templates = determine_templates_for_user
    @plan_model = determine_plan_model
  end

  def call
    create_plans
  end

  def create_plans
    plan_duration_types = [
      HealingPlan::DAILY, 
      HealingPlan::THREE_MONTH, 
      HealingPlan::SIX_MONTH
    ]

    plan_duration_types.each do |duration_type|
      template = templates.find_by(duration_type: duration_type)
      plan = plan_model.create(
        user: user,
        healing_plan_template: template,
        version: 1,
        duration_type: duration_type
      )
    end
  end

  private

  def determine_plan_model
    case health_assessment.assessment_type.to_sym
    when :prakruti
      PrakrutiPlan
    when :vikruti
      VikrutiPlan
    end
  end

  def determine_templates_for_user
    dosha = case health_assessment.assessment_type.to_sym
            when :prakruti
              @user.prakruti
            when :vikruti
              @user.vikruti
            end

    if dosha
      HealingPlanTemplate.where(dosha: dosha)
    else
      HealingPlanTemplate.none
    end
  end

  attr_reader :user, :health_assessment, :templates, :plan_model 
end
