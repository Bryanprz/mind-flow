FactoryBot.define do
  factory :user do
    name { "John Doe" }
    email_address { "test@test.com" }
    password { "password" }
    password_confirmation { "password" }
    date_of_birth { "2000-01-01" }
    time_of_birth { "12:00:00" }
  end
end