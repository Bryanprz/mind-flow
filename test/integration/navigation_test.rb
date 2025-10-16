require "test_helper"

class NavigationTest < ActionDispatch::IntegrationTest

  test "should have working navigation links" do
    # Test each navigation route
    get dashboard_path
    assert_response :success

    get analytics_path
    assert_response :success

    get goals_path
    assert_response :success

    get learning_path
    assert_response :success

    get notifications_path
    assert_response :success

    get settings_path
    assert_response :success
  end

  test "navigation links should render correct content" do
    # Test dashboard
    get dashboard_path
    assert_select "title", /Dashboard/

    # Test analytics
    get analytics_path
    assert_select "title", /Cognitive Analytics/
    assert_select "h1", text: "Cognitive Analytics"

    # Test goals
    get goals_path
    assert_select "title", /Cognitive Goals/
    assert_select "h1", text: "Cognitive Goals"

    # Test learning
    get learning_path
    assert_select "title", /Learning Hub/
    assert_select "h1", text: "Learning Hub"

    # Test notifications
    get notifications_path
    assert_select "title", /Notifications/
    assert_select "h1", text: "Notifications"

    # Test settings
    get settings_path
    assert_select "title", /Settings/
    assert_select "h1", text: "Settings"
  end

  test "pages should have consistent styling elements" do
    pages = [
      { path: analytics_path, title: "Cognitive Analytics", icon: "📊" },
      { path: goals_path, title: "Cognitive Goals", icon: "🎯" },
      { path: learning_path, title: "Learning Hub", icon: "📚" },
      { path: notifications_path, title: "Notifications", icon: "🔔" },
      { path: settings_path, title: "Settings", icon: "⚙️" }
    ]

    pages.each do |page|
      get page[:path]
      assert_response :success
      
      # Check for consistent header structure
      assert_select "h1" do |headers|
        assert headers.first.text.include?(page[:title])
        assert_select "span", text: page[:icon]
      end
      
      # Check for consistent background styling
      assert_select "div.min-h-screen.bg-gradient-to-br"
      
      # Check for consistent header styling
      assert_select "div.bg-black\\/20.backdrop-blur-sm.border-b.border-white\\/10"
    end
  end

  test "analytics page should have correct data structure" do
    get analytics_path
    assert_response :success
    
    # Check for performance metrics
    assert_select "h3", text: "Average Focus"
    assert_select "h3", text: "Flow State Hours"
    assert_select "h3", text: "Deep Work Sessions"
    assert_select "h3", text: "Consistency Score"
    
    # Check for charts section
    assert_select "h3", text: "Focus Trends (7 Days)"
    assert_select "h3", text: "Performance Breakdown"
    assert_select "h3", text: "Weekly Summary"
  end

  test "goals page should have correct data structure" do
    get goals_path
    assert_response :success
    
    # Check for goal categories
    assert_select "h3", text: "Focus & Concentration"
    assert_select "h3", text: "Learning & Growth"
    assert_select "h3", text: "Wellness & Balance"
    
    # Check for active goals section
    assert_select "h2", text: "Active Goals"
    
    # Check for completed goals section
    assert_select "h2", text: "Recently Completed"
  end

  test "learning page should have correct data structure" do
    get learning_path
    assert_response :success
    
    # Check for progress cards
    assert_select "h3", text: "Courses Completed"
    assert_select "h3", text: "Books Read"
    assert_select "h3", text: "Hours Studied"
    assert_select "h3", text: "Certificates"
    assert_select "h3", text: "Current Streak"
    
    # Check for current courses
    assert_select "h2", text: "Current Courses"
    
    # Check for learning resources
    assert_select "h2", text: "Recommended Resources"
    assert_select "h2", text: "Learning Path"
  end

  test "notifications page should have correct data structure" do
    get notifications_path
    assert_response :success
    
    # Check for notification stats
    assert_select "p", text: "Unread"
    assert_select "p", text: "Today"
    assert_select "p", text: "This Week"
    
    # Check for notification sections
    assert_select "h2", text: "Unread Notifications"
    assert_select "h2", text: "Recent Notifications"
    assert_select "h2", text: "Notification Preferences"
  end

  test "settings page should have correct data structure" do
    get settings_path
    assert_response :success
    
    # Check for settings sections
    assert_select "h2", text: "Profile Settings"
    assert_select "h2", text: "Preferences"
    assert_select "h2", text: "Privacy & Security"
    assert_select "h2", text: "Danger Zone"
    
    # Check for form elements
    assert_select "input[type='text']"
    assert_select "input[type='email']"
    assert_select "select"
  end

  test "logout should redirect properly" do
    get logout_path
    assert_response :redirect
  end

  test "pages should be accessible without authentication" do
    # All pages should be accessible without login for demo purposes
    get analytics_path
    assert_response :success

    get goals_path
    assert_response :success

    get learning_path
    assert_response :success

    get notifications_path
    assert_response :success

    get settings_path
    assert_response :success
  end

  test "pages should have proper meta tags" do
    get analytics_path
    assert_select "title", /Cognitive Analytics/

    get goals_path
    assert_select "title", /Cognitive Goals/

    get learning_path
    assert_select "title", /Learning Hub/

    get notifications_path
    assert_select "title", /Notifications/

    get settings_path
    assert_select "title", /Settings/
  end
end
