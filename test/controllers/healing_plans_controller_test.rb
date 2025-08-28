require "test_helper"

class HealingPlansControllerTest < ActionDispatch::IntegrationTest
  setup do
    @healing_plan = healing_plans(:one)
  end

  test "should get index" do
    get healing_plans_url
    assert_response :success
  end

  test "should get new" do
    get new_healing_plan_url
    assert_response :success
  end

  test "should create healing_plan" do
    assert_difference("HealingPlan.count") do
      post healing_plans_url, params: { healing_plan: { description: @healing_plan.description, title: @healing_plan.title, user_id: @healing_plan.user_id } }
    end

    assert_redirected_to healing_plan_url(HealingPlan.last)
  end

  test "should show healing_plan" do
    get healing_plan_url(@healing_plan)
    assert_response :success
  end

  test "should get edit" do
    get edit_healing_plan_url(@healing_plan)
    assert_response :success
  end

  test "should update healing_plan" do
    patch healing_plan_url(@healing_plan), params: { healing_plan: { description: @healing_plan.description, title: @healing_plan.title, user_id: @healing_plan.user_id } }
    assert_redirected_to healing_plan_url(@healing_plan)
  end

  test "should destroy healing_plan" do
    assert_difference("HealingPlan.count", -1) do
      delete healing_plan_url(@healing_plan)
    end

    assert_redirected_to healing_plans_url
  end
end
