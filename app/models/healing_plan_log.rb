class HealingPlanLog < ApplicationRecord
  belongs_to :healing_plan
  has_many :plan_item_logs
  has_one :user, through: :healing_plan

  def self.for_today(healing_plan)
    where(healing_plan: healing_plan, created_at: Date.current.all_day)
      .first_or_create
  end
end
