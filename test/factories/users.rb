FactoryBot.define do
  factory :user do
    first_name { "John" }
    last_name { "Doe" }
    email { "test@test.com" }
    password_digest { "password" }
    date_of_birth { "2000-01-01" }
    time_of_birth { "12:00:00" }
  end
end