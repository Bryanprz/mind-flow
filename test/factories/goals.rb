FactoryBot.define do
  factory :goal do
    user { nil }
    title { "MyString" }
    description { "MyText" }
    target { 1 }
    progress { 1 }
    deadline { "2025-10-19" }
    category { "MyString" }
    status { 1 }
    icon { "MyString" }
  end
end
