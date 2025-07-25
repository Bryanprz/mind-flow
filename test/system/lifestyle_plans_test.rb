require "application_system_test_case"

class LifestylePlansTest < ApplicationSystemTestCase
  setup do
    @lifestyle_plan = lifestyle_plans(:one)
  end

  test "visiting the index" do
    visit lifestyle_plans_url
    assert_selector "h1", text: "Lifestyle plans"
  end

  test "should create lifestyle plan" do
    visit lifestyle_plans_url
    click_on "New lifestyle plan"

    fill_in "Daily routine items", with: @lifestyle_plan.daily_routine_items
    fill_in "Seasonal practices data", with: @lifestyle_plan.seasonal_practices_data
    fill_in "Spiritual practices items", with: @lifestyle_plan.spiritual_practices_items
    click_on "Create Lifestyle plan"

    assert_text "Lifestyle plan was successfully created"
    click_on "Back"
  end

  test "should update Lifestyle plan" do
    visit lifestyle_plan_url(@lifestyle_plan)
    click_on "Edit this lifestyle plan", match: :first

    fill_in "Daily routine items", with: @lifestyle_plan.daily_routine_items
    fill_in "Seasonal practices data", with: @lifestyle_plan.seasonal_practices_data
    fill_in "Spiritual practices items", with: @lifestyle_plan.spiritual_practices_items
    click_on "Update Lifestyle plan"

    assert_text "Lifestyle plan was successfully updated"
    click_on "Back"
  end

  test "should destroy Lifestyle plan" do
    visit lifestyle_plan_url(@lifestyle_plan)
    click_on "Destroy this lifestyle plan", match: :first

    assert_text "Lifestyle plan was successfully destroyed"
  end
end
