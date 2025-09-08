require "test_helper"

class HealingPlanLogsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get healing_plan_logs_index_url
    assert_response :success
  end

  test "should get show" do
    get healing_plan_logs_show_url
    assert_response :success
  end
end
