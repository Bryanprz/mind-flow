class HealingPlan < ApplicationRecord
  DAILY = 'daily'.freeze
  THREE_MONTH = 'three_month'.freeze
  SIX_MONTH = 'six_month'.freeze

  enum :duration_type, { daily: 0, three_month: 1, six_month: 2 }
  belongs_to :user
  belongs_to :healing_plan_template
  has_many :plan_sections, dependent: :destroy
  has_many :plan_items, through: :plan_sections
  has_many :healing_plan_logs, dependent: :destroy
  alias_method :sections, :plan_sections
  alias_method :items, :plan_items

  before_create :set_details_from_template
  after_create :build_from_template

  def todays_log
    healing_plan_logs.find_by(date: Date.current)
  end

  private

  def set_details_from_template
    self.name ||= healing_plan_template.name
    self.description ||= healing_plan_template.description
    self.is_active = true # New plans are active by default
  end

  def build_from_template
    return if healing_plan_template.nil?
    sections_to_insert = []
    healing_plan_template.plan_section_templates.each do |section_template|
      sections_to_insert << {
        name: section_template.name,
        ordering: section_template.ordering,
        healing_plan_id: self.id,
        created_at: Time.current,
        updated_at: Time.current
      }
    end

    if sections_to_insert.any?
      inserted_sections = PlanSection.insert_all(sections_to_insert, returning: [:id, :name])

      section_id_map = inserted_sections.map { |s| [s['name'], s['id']] }.to_h

      items_to_insert = []
      healing_plan_template.plan_section_templates.each do |section_template|
        section_id = section_id_map[section_template.name]
        next unless section_id
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
      PlanItem.insert_all(items_to_insert) if items_to_insert.any?
    end
  end
end
