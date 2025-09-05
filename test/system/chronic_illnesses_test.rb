require "application_system_test_case"

class ChronicIllnessesTest < ApplicationSystemTestCase
  setup do
    @chronic_illness = chronic_illnesses(:one)
  end

  test "visiting the index" do
    visit chronic_illnesses_url
    assert_selector "h1", text: "Chronic illnesses"
  end

  test "should create chronic illness" do
    visit chronic_illnesses_url
    click_on "New chronic illness"

    fill_in "Description", with: @chronic_illness.description
    fill_in "Icon", with: @chronic_illness.icon
    fill_in "Name", with: @chronic_illness.name
    click_on "Create Chronic illness"

    assert_text "Chronic illness was successfully created"
    click_on "Back"
  end

  test "should update Chronic illness" do
    visit chronic_illness_url(@chronic_illness)
    click_on "Edit this chronic illness", match: :first

    fill_in "Description", with: @chronic_illness.description
    fill_in "Icon", with: @chronic_illness.icon
    fill_in "Name", with: @chronic_illness.name
    click_on "Update Chronic illness"

    assert_text "Chronic illness was successfully updated"
    click_on "Back"
  end

  test "should destroy Chronic illness" do
    visit chronic_illness_url(@chronic_illness)
    click_on "Destroy this chronic illness", match: :first

    assert_text "Chronic illness was successfully destroyed"
  end
end
