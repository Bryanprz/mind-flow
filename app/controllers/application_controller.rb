class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  helper_method :current_user

  def current_user
    # This is a placeholder. In a real application, you would have proper authentication logic here.
    # For example, you might find the user based on a session ID or a token.
    @current_user ||= User.first # Assuming you have a User model
  end
end
