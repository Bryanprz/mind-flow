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
      'daily', 
      'three_month', 
      'six_month'
    ]

    plan_duration_types.each do |duration_type|
      template = templates.find_by(duration_type: duration_type)
      plan = plan_model.new(
        user: user,
        healing_plan_template: template,
        version: 1,
        duration_type: duration_type
      )

      # Set default overview data
      plan.overview = {
        "focus_area_0" => "Sleep", "goal_0" => "Deeper rest",
        "focus_area_1" => "Digestion", "goal_1" => "Improve Agni",
        "focus_area_2" => "Energy", "goal_2" => "Maintain balance",
        "focus_area_3" => "Emotions", "goal_3" => "Reduce anxiety"
      }

      plan.save # Explicitly save the plan
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
    healing_focus = case health_assessment.assessment_type.to_sym
                    when :prakruti, :vikruti
                      # Find the dosha record
                      Dosha.find_by(name: @user.prakruti || @user.vikruti)
                    when :chronic_illness
                      # Find the chronic illness record
                      @user.chronic_illness
                    end

    if healing_focus
      HealingPlanTemplate.where(healing_focus: healing_focus)
    else
      HealingPlanTemplate.none
    end
  end

  attr_reader :user, :health_assessment, :templates, :plan_model 
end
