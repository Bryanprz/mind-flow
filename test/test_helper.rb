ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
require "factory_bot_rails"

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    # fixtures :all # Commented out to prevent fixture loading

    # Add more helper methods to be used by all tests here...
    include FactoryBot::Syntax::Methods

    def sign_in(user)
      post session_url, params: { email_address: user.email_address, password: 'password' }
    end
  end
end