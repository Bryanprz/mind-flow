class HabitLog < ApplicationRecord
  belongs_to :habit_plan
  has_many :plan_item_logs, dependent: :destroy
  has_one :user, through: :habit_plan

  def self.for_date(habit_plan, date = Date.current)
    where(habit_plan: habit_plan, date: date.all_day)
      .first_or_initialize
      .tap do |log|
        # Set the date if it's a new record or if it's not set
        log.date ||= date
        # Save only if this is a new record or if we made changes
        log.save! if log.new_record? || log.changed?
      end
  end

  def completed_item_ids
    plan_item_logs.where.not(completed_at: nil).pluck(:plan_item_id)
  end
end
