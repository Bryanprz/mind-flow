require "application_system_test_case"

class HerbsTest < ApplicationSystemTestCase
  setup do
    @herb = herbs(:one)
  end

  test "visiting the index" do
    visit herbs_url
    assert_selector "h1", text: "Herbs"
  end

  test "should create herb" do
    visit herbs_url
    click_on "New herb"

    fill_in "Contraindication", with: @herb.contraindication
    fill_in "Details", with: @herb.details
    fill_in "Elements", with: @herb.elements
    fill_in "Form of intake", with: @herb.form_of_intake
    fill_in "Guna quality", with: @herb.guna_quality
    fill_in "Habitat and source", with: @herb.habitat_and_source
    fill_in "Name", with: @herb.name
    fill_in "Prabhava special action", with: @herb.prabhava_special_action
    fill_in "Rasa taste", with: @herb.rasa_taste
    fill_in "Recipes", with: @herb.recipes
    fill_in "Recommendation", with: @herb.recommendation
    fill_in "Samskara preparation", with: @herb.samskara_preparation
    fill_in "Samyoga combination", with: @herb.samyoga_combination
    fill_in "Vipaka post digestive effect", with: @herb.vipaka_post_digestive_effect
    fill_in "Virya potency", with: @herb.virya_potency
    click_on "Create Herb"

    assert_text "Herb was successfully created"
    click_on "Back"
  end

  test "should update Herb" do
    visit herb_url(@herb)
    click_on "Edit this herb", match: :first

    fill_in "Contraindication", with: @herb.contraindication
    fill_in "Details", with: @herb.details
    fill_in "Elements", with: @herb.elements
    fill_in "Form of intake", with: @herb.form_of_intake
    fill_in "Guna quality", with: @herb.guna_quality
    fill_in "Habitat and source", with: @herb.habitat_and_source
    fill_in "Name", with: @herb.name
    fill_in "Prabhava special action", with: @herb.prabhava_special_action
    fill_in "Rasa taste", with: @herb.rasa_taste
    fill_in "Recipes", with: @herb.recipes
    fill_in "Recommendation", with: @herb.recommendation
    fill_in "Samskara preparation", with: @herb.samskara_preparation
    fill_in "Samyoga combination", with: @herb.samyoga_combination
    fill_in "Vipaka post digestive effect", with: @herb.vipaka_post_digestive_effect
    fill_in "Virya potency", with: @herb.virya_potency
    click_on "Update Herb"

    assert_text "Herb was successfully updated"
    click_on "Back"
  end

  test "should destroy Herb" do
    visit herb_url(@herb)
    click_on "Destroy this herb", match: :first

    assert_text "Herb was successfully destroyed"
  end
end
