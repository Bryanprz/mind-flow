FactoryBot.define do
  factory :plan_item_template do
    plan_section_template { nil }
    content { "MyText" }
    position { 1 }
  end
end
