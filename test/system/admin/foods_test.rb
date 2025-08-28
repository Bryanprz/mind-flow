require "application_system_test_case"

class Admin::FoodsTest < ApplicationSystemTestCase
  setup do
    @admin_food = admin_foods(:one)
  end

  test "visiting the index" do
    visit admin_foods_url
    assert_selector "h1", text: "Foods"
  end

  test "should create food" do
    visit admin_foods_url
    click_on "New food"

    click_on "Create Food"

    assert_text "Food was successfully created"
    click_on "Back"
  end

  test "should update Food" do
    visit admin_food_url(@admin_food)
    click_on "Edit this food", match: :first

    click_on "Update Food"

    assert_text "Food was successfully updated"
    click_on "Back"
  end

  test "should destroy Food" do
    visit admin_food_url(@admin_food)
    click_on "Destroy this food", match: :first

    assert_text "Food was successfully destroyed"
  end
end
