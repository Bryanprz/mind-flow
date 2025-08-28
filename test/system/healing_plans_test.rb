require "application_system_test_case"

class HealingPlansTest < ApplicationSystemTestCase
  setup do
    @healing_plan = healing_plans(:one)
  end

  test "visiting the index" do
    visit healing_plans_url
    assert_selector "h1", text: "Healing plans"
  end

  test "should create healing plan" do
    visit healing_plans_url
    click_on "New healing plan"

    fill_in "Description", with: @healing_plan.description
    fill_in "Title", with: @healing_plan.title
    fill_in "User", with: @healing_plan.user_id
    click_on "Create Healing plan"

    assert_text "Healing plan was successfully created"
    click_on "Back"
  end

  test "should update Healing plan" do
    visit healing_plan_url(@healing_plan)
    click_on "Edit this healing plan", match: :first

    fill_in "Description", with: @healing_plan.description
    fill_in "Title", with: @healing_plan.title
    fill_in "User", with: @healing_plan.user_id
    click_on "Update Healing plan"

    assert_text "Healing plan was successfully updated"
    click_on "Back"
  end

  test "should destroy Healing plan" do
    visit healing_plan_url(@healing_plan)
    click_on "Destroy this healing plan", match: :first

    assert_text "Healing plan was successfully destroyed"
  end
end
