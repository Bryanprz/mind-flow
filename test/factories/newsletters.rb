FactoryBot.define do
  factory :newsletter do
    sequence(:email_address) { |n| "user#{n}@example.com" }
    status { "subscribed" }
    active { true }
    subscribed_at { Time.current }
  end
end
