FactoryBot.define do
  factory :plan_item do
    content { "MyText" }
    completed { false }
    ordering { 1 }
    plan_section { nil }
  end
end
