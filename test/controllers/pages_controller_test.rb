require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest

  # Analytics Page Tests
  test "should get analytics page" do
    get analytics_path
    assert_response :success
    assert_select "h1", text: "Cognitive Analytics"
    assert_select "span", text: "📊"
  end

  test "analytics page should have performance metrics" do
    get analytics_path
    assert_response :success
    assert_select "h3", text: "Average Focus"
    assert_select "h3", text: "Flow State Hours"
    assert_select "h3", text: "Deep Work Sessions"
    assert_select "h3", text: "Consistency Score"
  end

  test "analytics page should have charts section" do
    get analytics_path
    assert_response :success
    assert_select "h3", text: "Focus Trends (7 Days)"
    assert_select "h3", text: "Performance Breakdown"
    assert_select "h3", text: "Weekly Summary"
  end

  # Goals Page Tests
  test "should get goals page" do
    get goals_path
    assert_response :success
    assert_select "h1", text: "Cognitive Goals"
    assert_select "span", text: "🎯"
  end

  test "goals page should have goal categories" do
    get goals_path
    assert_response :success
    assert_select "h3", text: "Focus & Concentration"
    assert_select "h3", text: "Learning & Growth"
    assert_select "h3", text: "Wellness & Balance"
  end

  test "goals page should have active goals" do
    get goals_path
    assert_response :success
    assert_select "h2", text: "Active Goals"
    assert_select "span", text: "🚀"
  end

  test "goals page should have completed goals" do
    get goals_path
    assert_response :success
    assert_select "h2", text: "Recently Completed"
    assert_select "span", text: "✅"
  end

  # Learning Page Tests
  test "should get learning page" do
    get learning_path
    assert_response :success
    assert_select "h1", text: "Learning Hub"
    assert_select "span", text: "📚"
  end

  test "learning page should have progress cards" do
    get learning_path
    assert_response :success
    assert_select "h3", text: "Courses Completed"
    assert_select "h3", text: "Books Read"
    assert_select "h3", text: "Hours Studied"
    assert_select "h3", text: "Certificates"
    assert_select "h3", text: "Current Streak"
  end

  test "learning page should have current courses" do
    get learning_path
    assert_response :success
    assert_select "h2", text: "Current Courses"
    assert_select "span", text: "🎯"
  end

  test "learning page should have learning resources" do
    get learning_path
    assert_response :success
    assert_select "h2", text: "Recommended Resources"
    assert_select "h2", text: "Learning Path"
  end

  # Notifications Page Tests
  test "should get notifications page" do
    get notifications_path
    assert_response :success
    assert_select "h1", text: "Notifications"
    assert_select "span", text: "🔔"
  end

  test "notifications page should have notification stats" do
    get notifications_path
    assert_response :success
    assert_select "p", text: "Unread"
    assert_select "p", text: "Today"
    assert_select "p", text: "This Week"
  end

  test "notifications page should have unread notifications" do
    get notifications_path
    assert_response :success
    assert_select "h2", text: "Unread Notifications"
    assert_select "span", text: "🔴"
  end

  test "notifications page should have recent notifications" do
    get notifications_path
    assert_response :success
    assert_select "h2", text: "Recent Notifications"
    assert_select "span", text: "📋"
  end

  test "notifications page should have notification preferences" do
    get notifications_path
    assert_response :success
    assert_select "h2", text: "Notification Preferences"
    assert_select "span", text: "⚙️"
  end

  # Settings Page Tests
  test "should get settings page" do
    get settings_path
    assert_response :success
    assert_select "h1", text: "Settings"
    assert_select "span", text: "⚙️"
  end

  test "settings page should have profile settings" do
    get settings_path
    assert_response :success
    assert_select "h2", text: "Profile Settings"
    assert_select "span", text: "👤"
  end

  test "settings page should have preferences" do
    get settings_path
    assert_response :success
    assert_select "h2", text: "Preferences"
    assert_select "span", text: "🎨"
  end

  test "settings page should have privacy settings" do
    get settings_path
    assert_response :success
    assert_select "h2", text: "Privacy & Security"
    assert_select "span", text: "🔒"
  end

  test "settings page should have danger zone" do
    get settings_path
    assert_response :success
    assert_select "h2", text: "Danger Zone"
    assert_select "span", text: "⚠️"
  end

  # Logout Tests
  test "should get logout page" do
    get logout_path
    assert_response :redirect
  end

  # Dashboard Tests
  test "should get dashboard page" do
    get dashboard_path
    assert_response :success
  end

  # Existing Demo Pages Tests
  test "should get demo community page" do
    get demo_community_path
    assert_response :success
  end

  test "should get demo messages page" do
    get demo_messages_path
    assert_response :success
  end

  test "should get demo saved posts page" do
    get demo_saved_posts_path
    assert_response :success
  end

  # Static Pages Tests
  test "should get terms of service page" do
    get terms_of_service_path
    assert_response :success
  end

  test "should get privacy policy page" do
    get privacy_policy_path
    assert_response :success
  end

  test "should get contact us page" do
    get contact_us_path
    assert_response :success
  end
end
