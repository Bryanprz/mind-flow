class CreateHealingPlanService
  def initialize(user, healing_plan_template)
    @user = user
    @healing_plan_template = healing_plan_template
    @healing_plan = nil
  end

  def call
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
    sections_to_insert = []
    @healing_plan_template.plan_section_templates.each do |section_template|
      sections_to_insert << {
        name: section_template.name,
        ordering: section_template.ordering,
        healing_plan_id: @healing_plan.id,
        created_at: Time.current,
        updated_at: Time.current
      }
    end

    inserted_sections = PlanSection.insert_all(sections_to_insert, returning: [:id, :name])

    section_id_map = inserted_sections.map { |s| [s['name'], s['id']] }.to_h

    items_to_insert = []
    @healing_plan_template.plan_section_templates.each do |section_template|
      section_id = section_id_map[section_template.name]
      section_template.plan_item_templates.each do |item_template|
        items_to_insert << {
          content: item_template.content,
          ordering: item_template.ordering,
          plan_section_id: section_id,
          created_at: Time.current,
          updated_at: Time.current
        }
      end
    end
    PlanItem.insert_all(items_to_insert)
  end
end
