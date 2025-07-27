FactoryBot.define do
  factory :question do
    text { 'Is your body constitution lanky, medium, or heavy-set?' }
    disturbed_doshas { ['vata', 'pitta', 'kapha'] }
    association :quiz
  end
end
