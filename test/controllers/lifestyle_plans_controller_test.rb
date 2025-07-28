require "test_helper"

class LifestylePlansControllerTest < ActionDispatch::IntegrationTest
  setup do
    @lifestyle_plan = create(:lifestyle_plan)
  end

  test "should get index" do
    get lifestyle_plans_url
    assert_response :success
  end

  test "should get new" do
    get new_lifestyle_plan_url
    assert_response :success
  end

  test "should create lifestyle_plan" do
    assert_difference("LifestylePlan.count") do
      post lifestyle_plans_url, params: { lifestyle_plan: { daily_routine_items: @lifestyle_plan.daily_routine_items, seasonal_practices_data: @lifestyle_plan.seasonal_practices_data, spiritual_practices_items: @lifestyle_plan.spiritual_practices_items } }
    end

    assert_redirected_to lifestyle_plan_url(LifestylePlan.last)
  end

  test "should show lifestyle_plan" do
    get lifestyle_plan_url(@lifestyle_plan)
    assert_response :success
  end

  test "should get edit" do
    get edit_lifestyle_plan_url(@lifestyle_plan)
    assert_response :success
  end

  test "should update lifestyle_plan" do
    patch lifestyle_plan_url(@lifestyle_plan), params: { lifestyle_plan: { daily_routine_items: @lifestyle_plan.daily_routine_items, seasonal_practices_data: @lifestyle_plan.seasonal_practices_data, spiritual_practices_items: @lifestyle_plan.spiritual_practices_items } }
    assert_redirected_to lifestyle_plan_url(@lifestyle_plan)
  end

  test "should destroy lifestyle_plan" do
    assert_difference("LifestylePlan.count", -1) do
      delete lifestyle_plan_url(@lifestyle_plan)
    end

    assert_redirected_to lifestyle_plans_url
  end
end
