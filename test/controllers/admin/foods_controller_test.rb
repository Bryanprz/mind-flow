require "test_helper"

class Admin::FoodsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @admin_food = admin_foods(:one)
  end

  test "should get index" do
    get admin_foods_url
    assert_response :success
  end

  test "should get new" do
    get new_admin_food_url
    assert_response :success
  end

  test "should create admin_food" do
    assert_difference("Admin::Food.count") do
      post admin_foods_url, params: { admin_food: {} }
    end

    assert_redirected_to admin_food_url(Admin::Food.last)
  end

  test "should show admin_food" do
    get admin_food_url(@admin_food)
    assert_response :success
  end

  test "should get edit" do
    get edit_admin_food_url(@admin_food)
    assert_response :success
  end

  test "should update admin_food" do
    patch admin_food_url(@admin_food), params: { admin_food: {} }
    assert_redirected_to admin_food_url(@admin_food)
  end

  test "should destroy admin_food" do
    assert_difference("Admin::Food.count", -1) do
      delete admin_food_url(@admin_food)
    end

    assert_redirected_to admin_foods_url
  end
end
