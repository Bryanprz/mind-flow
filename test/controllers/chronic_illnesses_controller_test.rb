require "test_helper"

class ChronicIllnessesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @chronic_illness = chronic_illnesses(:one)
  end

  test "should get index" do
    get chronic_illnesses_url
    assert_response :success
  end

  test "should get new" do
    get new_chronic_illness_url
    assert_response :success
  end

  test "should create chronic_illness" do
    assert_difference("ChronicIllness.count") do
      post chronic_illnesses_url, params: { chronic_illness: { description: @chronic_illness.description, icon: @chronic_illness.icon, name: @chronic_illness.name } }
    end

    assert_redirected_to chronic_illness_url(ChronicIllness.last)
  end

  test "should show chronic_illness" do
    get chronic_illness_url(@chronic_illness)
    assert_response :success
  end

  test "should get edit" do
    get edit_chronic_illness_url(@chronic_illness)
    assert_response :success
  end

  test "should update chronic_illness" do
    patch chronic_illness_url(@chronic_illness), params: { chronic_illness: { description: @chronic_illness.description, icon: @chronic_illness.icon, name: @chronic_illness.name } }
    assert_redirected_to chronic_illness_url(@chronic_illness)
  end

  test "should destroy chronic_illness" do
    assert_difference("ChronicIllness.count", -1) do
      delete chronic_illness_url(@chronic_illness)
    end

    assert_redirected_to chronic_illnesses_url
  end
end
