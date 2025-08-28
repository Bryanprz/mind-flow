require "application_system_test_case"

class HealingPlanFoodsTest < ApplicationSystemTestCase
  setup do
    @healing_plan_food = healing_plan_foods(:one)
  end

  test "visiting the index" do
    visit healing_plan_foods_url
    assert_selector "h1", text: "Healing plan foods"
  end

  test "should create healing plan food" do
    visit healing_plan_foods_url
    click_on "New healing plan food"

    fill_in "Food", with: @healing_plan_food.food_id
    fill_in "Healing plan", with: @healing_plan_food.healing_plan_id
    click_on "Create Healing plan food"

    assert_text "Healing plan food was successfully created"
    click_on "Back"
  end

  test "should update Healing plan food" do
    visit healing_plan_food_url(@healing_plan_food)
    click_on "Edit this healing plan food", match: :first

    fill_in "Food", with: @healing_plan_food.food_id
    fill_in "Healing plan", with: @healing_plan_food.healing_plan_id
    click_on "Update Healing plan food"

    assert_text "Healing plan food was successfully updated"
    click_on "Back"
  end

  test "should destroy Healing plan food" do
    visit healing_plan_food_url(@healing_plan_food)
    click_on "Destroy this healing plan food", match: :first

    assert_text "Healing plan food was successfully destroyed"
  end
end
