class ApplicationController < ActionController::Base
  include Authentication
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  around_action :set_time_zone

  helper_method :current_user

  # TODO clean this up
  def current_user
    @current_user ||= Current.session&.user
  end

  # Test method for exception notifications - only available in production
  def test_exception
    raise StandardError, "Test exception for email notification - #{Time.current}"
  end

  private

  def set_time_zone(&block)
    # Try to get the time zone from the logged-in user's profile first.
    # Fall back to the browser-detected time zone stored in a cookie.
    time_zone = current_user&.time_zone || cookies[:time_zone]

    # Only use valid time zones.
    if time_zone.present? && ActiveSupport::TimeZone[time_zone].present?
      Time.use_zone(time_zone, &block)
    else
      # If no time zone is found, execute the request in the default (UTC).
      yield
    end
  end
end
