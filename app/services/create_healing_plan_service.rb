# TODO update this logic with real logic
class CreateHealingPlanService
  def initialize(user, healing_plan_template)
    @user = user
    @healing_plan_template = healing_plan_template
    @healing_plan = nil
  end

  def call
    # This is the main method to generate the protocol.
    # For now, it uses placeholder logic.
    # In the future, this will house the complex rules based on assessments and goals.

    ActiveRecord::Base.transaction do
      create_healing_plan
      copy_plan_sections_and_items_from_template
    end

    @healing_plan
  end

  private

  def create_healing_plan
    # For simplicity, we'll create a new lineage here.
    # A more complex implementation might find the latest version and create a new one.
    @healing_plan = @user.healing_plans.create!(
      name: @healing_plan_template.name,
      description: @healing_plan_template.description,
      healing_plan_template: @healing_plan_template,
      version: 1,
      lineage_id: SecureRandom.uuid,
      is_active: true # We might want to deactivate other plans here.
    )
  end

  def copy_plan_sections_and_items_from_template
    @healing_plan_template.plan_section_templates.each do |section_template|
      section = @healing_plan.plan_sections.create!(
        name: section_template.name,
        ordering: section_template.ordering
      )
      add_items_to_section(section, section_template.plan_item_templates)
    end
  end

  def add_items_to_section(section, item_templates)
    item_templates.each do |item_template|
      section.plan_items.create!(
        content: item_template.content,
        ordering: item_template.ordering
      )
    end
  end
end
