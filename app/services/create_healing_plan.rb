class CreateHealingPlan
  def initialize(user, health_assessment)
    @user = user
    @health_assessment = health_assessment
  end

  def call
    templates = determine_templates_for_user

    if templates.empty?
      Rails.logger.warn "Could not determine any healing plan templates for user #{user.id}"
      return []
    end

    # Sort templates by the enum order to ensure 'daily' is first.
    sorted_templates = templates.sort_by { |t| HealingPlanTemplate.duration_types[t.duration_type] }

    first_template = sorted_templates.first
    plan_model = determine_plan_model
    return [] unless plan_model && first_template

    # Create the first plan to establish the lineage ID
    first_plan = plan_model.create(
      user: user,
      healing_plan_template: first_template,
      version: 1,
      duration_type: first_template.duration_type
    )

    unless first_plan.persisted?
      Rails.logger.error "Failed to create the first healing plan for user #{user.id}, template #{first_template.id}"
      return []
    end

    # Use the first plan's ID as the lineage ID for the set
    lineage_id = first_plan.id.to_s
    first_plan.update!(lineage_id: lineage_id)

    created_plans = [first_plan]

    # Create the rest of the plans
    sorted_templates.drop(1).each do |template|
      plan = plan_model.create(
        user: user,
        healing_plan_template: template,
        version: 1,
        duration_type: template.duration_type,
        lineage_id: lineage_id
      )
      created_plans << plan if plan.persisted?
    end

    created_plans
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

  attr_reader :user, :health_assessment
end