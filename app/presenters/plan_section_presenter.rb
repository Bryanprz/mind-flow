class PlanSectionPresenter < SimpleDelegator
  attr_reader :todays_plan_log

def initialize(plan_section, todays_plan_log)
  super(plan_section)
  @todays_plan_log = todays_plan_log
end

def completed_today?
  return false unless todays_plan_log
  plan_items.any? { |item| item.plan_item_logs.where(healing_plan_log: todays_plan_log).exists? }
end

def first_item_preview
  plan_items.first&.content&.first(15)
end

# Delegate name to the wrapped section
def name
  __getobj__.name
end
end
