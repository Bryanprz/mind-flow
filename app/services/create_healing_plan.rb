class CreateHealingPlan
  def initialize(user, health_assessment, chronic_illness_ids: [])
    @user = user
    @health_assessment = health_assessment
    @chronic_illness_ids = chronic_illness_ids
    @dosha_templates = determine_dosha_templates_for_user
    @chronic_illness_templates = determine_chronic_illness_templates
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
      if duration_type == 'daily'
        # Create consolidated daily plan with all elements (dosha + chronic illness)
        create_consolidated_daily_plan
      else
        # Create standard 3-month and 6-month plans (dosha only)
        create_standard_plan(duration_type)
      end
    end
  end

  private

  def determine_plan_model
    # Always use HealingPlan for all assessment types
    HealingPlan
  end

  def determine_dosha_templates_for_user
    dosha = case health_assessment.assessment_type.to_sym
            when :prakruti
              @user.prakruti
            when :vikruti
              @user.vikruti
            end

    if dosha
      HealingPlanTemplate.where(healing_focus: dosha)
    else
      HealingPlanTemplate.none
    end
  end

  def determine_chronic_illness_templates
    return [] if @chronic_illness_ids.empty?

    # Get all chronic illness templates for the selected chronic illnesses
    ChronicIllness.where(id: @chronic_illness_ids)
                  .joins(:healing_plan_templates)
                  .includes(:healing_plan_templates)
                  .flat_map(&:healing_plan_templates)
  end

  def create_consolidated_daily_plan
    # Get the daily dosha template as the base
    dosha_template = @dosha_templates.find_by(duration_type: 'daily')
    
    # Get all chronic illness daily templates
    chronic_illness_templates = @chronic_illness_templates.select { |t| t.duration_type == 'daily' }
    
    # Create the plan using dosha template as base (fallback to first available template if dosha template not found)
    base_template = dosha_template || @dosha_templates.first || @chronic_illness_templates.first
    
    # Skip if no template exists
    return nil unless base_template
    
    plan = HealingPlan.new(
      user: @user,
      healing_plan_template: base_template,
      version: 1,
      duration_type: 'daily',
      skip_build_from_template: true  # Skip the callback since we're handling sections manually
    )

    # Set default overview data
    plan.overview = {
      "focus_area_0" => "Sleep", "goal_0" => "Deeper rest",
      "focus_area_1" => "Digestion", "goal_1" => "Improve Agni", 
      "focus_area_2" => "Energy", "goal_2" => "Maintain balance",
      "focus_area_3" => "Emotions", "goal_3" => "Reduce anxiety"
    }

    plan.save!

    # Accumulate all sections and items from both dosha and chronic illness templates
    accumulated_sections = []
    
    # Add dosha template sections first
    if dosha_template
      dosha_template.plan_section_templates.each do |section_template|
        accumulated_sections << {
          name: section_template.name,
          position: section_template.position,
          items: section_template.plan_item_templates.map do |item_template|
            {
              content: item_template.content,
              position: item_template.position
            }
          end
        }
      end
    end
    
    # Add chronic illness template sections
    chronic_illness_templates.each do |chronic_illness_template|
      chronic_illness = chronic_illness_template.healing_focus
      next unless chronic_illness.is_a?(ChronicIllness)
      
      chronic_illness_template.plan_section_templates.each do |section_template|
        # Prefix section name with chronic illness name
        section_name = "#{chronic_illness.name}: #{section_template.name}"
        
        accumulated_sections << {
          name: section_name,
          position: accumulated_sections.length + 1, # Append after existing sections
          items: section_template.plan_item_templates.map do |item_template|
            {
              content: item_template.content,
              position: item_template.position
            }
          end
        }
      end
    end
    
    # Create all sections and items in the consolidated plan
    create_consolidated_sections_and_items(plan, accumulated_sections)
    
    plan
  end

  def create_standard_plan(duration_type)
    # Keep existing logic for 3-month and 6-month plans
    template = @dosha_templates.find_by(duration_type: duration_type)
    
    # Skip if no template exists for this duration type
    return nil unless template
    
    plan = HealingPlan.new(
      user: @user,
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

    plan.save!
    
    # Build sections from template (existing logic)
    build_sections_from_template(plan, template)
    
    plan
  end

  def build_sections_from_template(plan, template)
    return unless template

    sections_to_insert = []
    template.plan_section_templates.each do |section_template|
      sections_to_insert << {
        name: section_template.name,
        position: section_template.position,
        healing_plan_id: plan.id,
        created_at: Time.current,
        updated_at: Time.current
      }
    end

    if sections_to_insert.any?
      inserted_sections = PlanSection.insert_all(sections_to_insert, returning: [:id, :name])
      section_id_map = inserted_sections.map { |s| [s['name'], s['id']] }.to_h

      items_to_insert = []
      template.plan_section_templates.each do |section_template|
        section_id = section_id_map[section_template.name]
        next unless section_id
        
        section_template.plan_item_templates.each do |item_template|
          items_to_insert << {
            content: item_template.content,
            position: item_template.position,
            plan_section_id: section_id,
            created_at: Time.current,
            updated_at: Time.current
          }
        end
      end

      PlanItem.insert_all(items_to_insert) if items_to_insert.any?
    end
  end

  def create_consolidated_sections_and_items(plan, accumulated_sections)
    return if accumulated_sections.empty?

    # Remove duplicates by section name to prevent duplicate sections
    unique_sections = accumulated_sections.uniq { |section| section[:name] }
    
    # Create sections individually and let acts_as_list handle positioning
    section_id_map = {}
    unique_sections.each do |section_data|
      section = PlanSection.create!(
        name: section_data[:name],
        healing_plan_id: plan.id
        # Let acts_as_list handle position automatically
      )
      section_id_map[section_data[:name]] = section.id
    end

    # Create all items
    items_to_insert = []
    unique_sections.each do |section_data|
      section_id = section_id_map[section_data[:name]]
      next unless section_id
      
      section_data[:items].each do |item_data|
        items_to_insert << {
          content: item_data[:content],
          position: item_data[:position],
          plan_section_id: section_id,
          created_at: Time.current,
          updated_at: Time.current
        }
      end
    end

    PlanItem.insert_all(items_to_insert) if items_to_insert.any?
  end

  attr_reader :user, :health_assessment, :chronic_illness_ids, :dosha_templates, :chronic_illness_templates 
end
