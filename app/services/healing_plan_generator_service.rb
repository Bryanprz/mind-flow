# TODO update this logic with real logic
class HealingPlanGeneratorService
  def initialize(user, goals)
    @user = user
    @goals = goals # e.g., ['sleep', 'digestion']
    @healing_plan = nil
  end

  def call
    # This is the main method to generate the protocol.
    # For now, it uses placeholder logic.
    # In the future, this will house the complex rules based on assessments and goals.

    ActiveRecord::Base.transaction do
      create_healing_plan
      create_plan_sections
    end

    @healing_plan
  end

  private

  def create_healing_plan
    # For simplicity, we'll create a new lineage here.
    # A more complex implementation might find the latest version and create a new one.
    @healing_plan = @user.healing_plans.create!(
      name: "My New Healing Plan",
      version: 1,
      lineage_id: SecureRandom.uuid,
      is_active: true # We might want to deactivate other plans here.
    )
  end

  def create_plan_sections
    sections = ["Morning", "Midday", "Evening", "Diet Principles", "Movement", "Breathwork"]

    sections.each_with_index do |section_name, index|
      section = @healing_plan.plan_sections.create!(name: section_name, ordering: index + 1)
      add_placeholder_items_for(section)
    end
  end

  def add_placeholder_items_for(section)
    # Add placeholder items based on the section name.
    # This is where the real "AI" or rule-based logic will go.
    case section.name
    when "Morning"
      section.plan_items.create!(content: "Drink a glass of warm water upon waking.", ordering: 1)
      section.plan_items.create!(content: "Gentle stretching for 10 minutes.", ordering: 2)
    when "Diet Principles"
      section.plan_items.create!(content: "Favor warm, cooked foods over raw foods.", ordering: 1)
      section.plan_items.create!(content: "Incorporate all six tastes (sweet, sour, salty, pungent, bitter, astringent) in your main meal.", ordering: 2)
    else
      section.plan_items.create!(content: "Placeholder item for #{section.name}.", ordering: 1)
    end
  end
end
