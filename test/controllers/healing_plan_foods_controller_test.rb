require "test_helper"

class HealingPlanFoodsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @healing_plan_food = healing_plan_foods(:one)
  end

  test "should get index" do
    get healing_plan_foods_url
    assert_response :success
  end

  test "should get new" do
    get new_healing_plan_food_url
    assert_response :success
  end

  test "should create healing_plan_food" do
    assert_difference("HealingPlanFood.count") do
      post healing_plan_foods_url, params: { healing_plan_food: { food_id: @healing_plan_food.food_id, healing_plan_id: @healing_plan_food.healing_plan_id } }
    end

    assert_redirected_to healing_plan_food_url(HealingPlanFood.last)
  end

  test "should show healing_plan_food" do
    get healing_plan_food_url(@healing_plan_food)
    assert_response :success
  end

  test "should get edit" do
    get edit_healing_plan_food_url(@healing_plan_food)
    assert_response :success
  end

  test "should update healing_plan_food" do
    patch healing_plan_food_url(@healing_plan_food), params: { healing_plan_food: { food_id: @healing_plan_food.food_id, healing_plan_id: @healing_plan_food.healing_plan_id } }
    assert_redirected_to healing_plan_food_url(@healing_plan_food)
  end

  test "should destroy healing_plan_food" do
    assert_difference("HealingPlanFood.count", -1) do
      delete healing_plan_food_url(@healing_plan_food)
    end

    assert_redirected_to healing_plan_foods_url
  end
end
