class HealingProtocolManager
  def initialize(user, assessment_type = nil)
    @user = user
    @assessment_type = assessment_type # Optional: if manager needs to know what triggered it
  end

  def determine_and_apply_protocol
    # 1. Determine the appropriate template based on user's state
    template = determine_template_for_user

    # 2. Apply the protocol using the service
    if template
      CreateHealingPlanService.new(@user, template).call
    else
      # Handle case where no template can be determined (e.g., log, alert)
      Rails.logger.warn "Could not determine healing plan template for user #{@user.id}"
    end
  end

  private

  def determine_template_for_user
    # This is where the "order and intensity" logic lives
    # Initial simple logic: Vikruti takes precedence if present, otherwise Prakruti
    if @user.vikruti.present?
      # For now, assume Vikruti-based templates are named "Dosha Balancing Plan"
      # We might need more specific Vikruti templates later (e.g., "Vata Vikruti Balancing Plan")
      HealingPlanTemplate.find_by(dosha: @user.vikruti)
    elsif @user.prakruti.present?
      HealingPlanTemplate.find_by(dosha: @user.prakruti)
    else
      nil # No Dosha information to determine a plan
    end
  end
end
