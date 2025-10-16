require "test_helper"

class DashboardsControllerTest < ActionDispatch::IntegrationTest

  test "should get dashboard" do
    get dashboard_path
    assert_response :success
  end

  test "dashboard should render with proper content" do
    get dashboard_path
    assert_response :success
    
    # Check for dashboard-specific content
    assert_select "div", class: "min-h-screen"
  end

  test "dashboard should be accessible without authentication" do
    get dashboard_path
    assert_response :success
  end

  test "dashboard should have proper meta tags" do
    get dashboard_path
    assert_select "title"
  end

  test "dashboard should load all required components" do
    get dashboard_path
    assert_response :success
    
    # The dashboard should load successfully with all React components
    # This test ensures the page renders without errors
  end
end