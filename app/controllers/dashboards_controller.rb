class DashboardsController < ApplicationController
  layout 'with_sidebar'

  def show
    # Simple dashboard setup
  end

  private
  
  def current_user_json
    {
      id: Current.user.id,
      name: Current.user.name,
      slug: Current.user.slug,
      hasCheckedInToday: Current.user.has_checked_in_today?
    }
  end
end