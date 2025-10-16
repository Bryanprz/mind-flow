require "test_helper"

class SimplePagesTest < ActionDispatch::IntegrationTest
  test "should get analytics page" do
    get analytics_path
    assert_response :success
  end

  test "should get goals page" do
    get goals_path
    assert_response :success
  end

  test "should get learning page" do
    get learning_path
    assert_response :success
  end

  test "should get notifications page" do
    get notifications_path
    assert_response :success
  end

  test "should get settings page" do
    get settings_path
    assert_response :success
  end

  test "should get dashboard page" do
    get dashboard_path
    assert_response :success
  end

  test "should delete logout" do
    delete logout_path
    assert_response :redirect
  end

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
