require "application_system_test_case"

class CuresTest < ApplicationSystemTestCase
  setup do
    @cure = cures(:one)
  end

  test "visiting the index" do
    visit cures_url
    assert_selector "h1", text: "Cures"
  end

  test "should create cure" do
    visit cures_url
    click_on "New cure"

    fill_in "Contraindication", with: @cure.contraindication
    fill_in "Details", with: @cure.details
    fill_in "Elements", with: @cure.elements
    fill_in "Form of intake", with: @cure.form_of_intake
    fill_in "Guna quality", with: @cure.guna_quality
    fill_in "Habitat and source", with: @cure.habitat_and_source
    fill_in "Name", with: @cure.name
    fill_in "Prabhava special action", with: @cure.prabhava_special_action
    fill_in "Rasa taste", with: @cure.rasa_taste
    fill_in "Recipes", with: @cure.recipes
    fill_in "Recommendation", with: @cure.recommendation
    fill_in "Samskara preparation", with: @cure.samskara_preparation
    fill_in "Samyoga combination", with: @cure.samyoga_combination
    fill_in "Vipaka post digestive effect", with: @cure.vipaka_post_digestive_effect
    fill_in "Virya potency", with: @cure.virya_potency
    click_on "Create Cure"

    assert_text "Cure was successfully created"
    click_on "Back"
  end

  test "should update Cure" do
    visit cure_url(@cure)
    click_on "Edit this cure", match: :first

    fill_in "Contraindication", with: @cure.contraindication
    fill_in "Details", with: @cure.details
    fill_in "Elements", with: @cure.elements
    fill_in "Form of intake", with: @cure.form_of_intake
    fill_in "Guna quality", with: @cure.guna_quality
    fill_in "Habitat and source", with: @cure.habitat_and_source
    fill_in "Name", with: @cure.name
    fill_in "Prabhava special action", with: @cure.prabhava_special_action
    fill_in "Rasa taste", with: @cure.rasa_taste
    fill_in "Recipes", with: @cure.recipes
    fill_in "Recommendation", with: @cure.recommendation
    fill_in "Samskara preparation", with: @cure.samskara_preparation
    fill_in "Samyoga combination", with: @cure.samyoga_combination
    fill_in "Vipaka post digestive effect", with: @cure.vipaka_post_digestive_effect
    fill_in "Virya potency", with: @cure.virya_potency
    click_on "Update Cure"

    assert_text "Cure was successfully updated"
    click_on "Back"
  end

  test "should destroy Cure" do
    visit cure_url(@cure)
    click_on "Destroy this cure", match: :first

    assert_text "Cure was successfully destroyed"
  end
end
