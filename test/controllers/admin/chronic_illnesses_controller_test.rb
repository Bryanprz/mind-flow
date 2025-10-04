require "test_helper"

class Admin::ChronicIllnessesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get admin_chronic_illnesses_index_url
    assert_response :success
  end

  test "should get show" do
    get admin_chronic_illnesses_show_url
    assert_response :success
  end

  test "should get new" do
    get admin_chronic_illnesses_new_url
    assert_response :success
  end

  test "should get edit" do
    get admin_chronic_illnesses_edit_url
    assert_response :success
  end

  test "should get create" do
    get admin_chronic_illnesses_create_url
    assert_response :success
  end

  test "should get update" do
    get admin_chronic_illnesses_update_url
    assert_response :success
  end

  test "should get destroy" do
    get admin_chronic_illnesses_destroy_url
    assert_response :success
  end
end
