class HealingPlan < ApplicationRecord
  DAILY = 'daily'.freeze
  THREE_MONTH = 'three_month'.freeze
  SIX_MONTH = 'six_month'.freeze

  enum :duration_type, { daily: 0, three_month: 1, six_month: 2 }
  belongs_to :user
  has_rich_text :description
  belongs_to :healing_plan_template
  has_many :plan_sections, dependent: :destroy
  has_many :plan_items, through: :plan_sections
  has_many :logs, class_name: 'HealingPlanLog', dependent: :destroy

  accepts_nested_attributes_for :plan_sections, allow_destroy: true
  
  store_accessor :overview, *(0..3).map { |i| ["focus_area_#{i}", "goal_#{i}"] }.flatten

  # Validate that plan items have content
  validate :reject_empty_plan_items
  
  # Clean up empty plan items before validation
  before_validation :clean_empty_plan_items
  
  def reject_empty_plan_items
    plan_sections.each do |section|
      section.plan_items.each do |item|
        if item.content.blank? && !item.marked_for_destruction?
          errors.add(:base, "Plan items cannot be empty")
          return
        end
      end
    end
  end
  
  def clean_empty_plan_items
    plan_sections.each do |section|
      section.plan_items.each do |item|
        if item.content.blank? && !item.marked_for_destruction?
          if item.persisted?
            item.mark_for_destruction
          else
            section.plan_items.delete(item)
          end
        end
      end
    end
  end

  alias_method :healing_plan_logs, :logs
  alias_method :sections, :plan_sections
  alias_method :items, :plan_items

  # Returns the current streak of consecutive days with completed healing plan logs
  # @return [Integer] the number of consecutive days with completed logs, up to today
  # Milestone thresholds and their corresponding messages
  STREAK_MILESTONES = {
    3 => "Great start! You're on a %d-day streak! 🎉",
    7 => "One week strong! %d days in a row! 🚀",
    14 => "Two weeks of dedication! %d days! 🌟",
    30 => "A whole month! %d days and counting! 🎊",
    60 => "Incredible! %d days of commitment! 💪",
    90 => "3 months strong! %d days! 🏆",
    180 => "Half a year streak! %d days! 🌈",
    365 => "A full year! %d days of healing! 🎯"
  }.freeze

  def current_streak
    return 0 if healing_plan_logs.none?
    
    # Get all unique dates with completed logs, sorted in descending order
    completed_dates = healing_plan_logs
                     .where.not(completed_at: nil)
                     .pluck(:completed_at)
                     .map(&:to_date)
                     .uniq
                     .sort
                     .reverse
    
    return 0 if completed_dates.empty?
    
    # If the last completion wasn't today or yesterday, streak is 0
    return 0 unless [Date.current, Date.current - 1.day].include?(completed_dates.first)
    
    # Start with 1 for the most recent day
    streak = 1
    
    # Check previous days for consecutive completion
    completed_dates.each_cons(2) do |current_date, next_date|
      break if (current_date - 1.day) != next_date
      streak += 1
    end
    
    streak
  end

  # Returns the next milestone to achieve
  def next_milestone
    current = current_streak
    STREAK_MILESTONES.keys.sort.find { |milestone| milestone > current } || nil
  end

  # Returns the current milestone message if achieved today
  def milestone_message
    current = current_streak
    return unless STREAK_MILESTONES.key?(current)
    
    # Only show milestone message on the day it was achieved
    last_completion = healing_plan_logs.maximum(:completed_at)&.to_date
    return unless last_completion == Date.current
    
    STREAK_MILESTONES[current] % current
  end

  # Returns progress to next milestone (0.0 to 1.0)
  def milestone_progress
    current = current_streak
    next_milestone = self.next_milestone
    return 0.0 if next_milestone.nil? || current.zero?
    
    # Find the previous milestone (or 0 if this is the first milestone)
    prev_milestone = STREAK_MILESTONES.keys.sort.reverse.find { |m| m < current } || 0
    
    (current - prev_milestone).to_f / (next_milestone - prev_milestone)
  end

  before_create :set_details_from_template
  after_create :build_from_template

  # for Cally calendar API
  # return data as "2024-01-10 2024-01-20"
  def completed_days_this_month
    if duration_type == HealingPlan::DAILY
      return logs.pluck(:date).map { |d| d.strftime("%Y-%m-%d") }.join(" ")
    end
  end

  def todays_log
    logs.find_by(date: Date.current)
  end

  private

  def set_details_from_template
    self.name ||= healing_plan_template.name
    self.description ||= healing_plan_template.description
    self.duration_type ||= healing_plan_template.duration_type
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
