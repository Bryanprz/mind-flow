require "application_system_test_case"

class FoodsTest < ApplicationSystemTestCase
  setup do
    @food = foods(:one)
  end

  test "visiting the index" do
    visit foods_url
    assert_selector "h1", text: "Foods"
  end

  test "should create food" do
    visit foods_url
    click_on "New food"

    fill_in "Contraindication", with: @food.contraindication
    fill_in "Details", with: @food.details
    fill_in "Form of intake", with: @food.form_of_intake
    fill_in "Guna quality", with: @food.guna_quality
    fill_in "Habitat and source", with: @food.habitat_and_source
    fill_in "Name", with: @food.name
    fill_in "Prabhava special action", with: @food.prabhava_special_action
    fill_in "Rasa taste", with: @food.rasa_taste
    fill_in "Recommendation", with: @food.recommendation
    fill_in "Samskara preparation", with: @food.samskara_preparation
    fill_in "Samyoga combination", with: @food.samyoga_combination
    fill_in "Vipaka post digestive effect", with: @food.vipaka_post_digestive_effect
    fill_in "Virya potency", with: @food.virya_potency
    click_on "Create Food"

    assert_text "Food was successfully created"
    click_on "Back"
  end

  test "should update Food" do
    visit food_url(@food)
    click_on "Edit this food", match: :first

    fill_in "Contraindication", with: @food.contraindication
    fill_in "Details", with: @food.details
    fill_in "Form of intake", with: @food.form_of_intake
    fill_in "Guna quality", with: @food.guna_quality
    fill_in "Habitat and source", with: @food.habitat_and_source
    fill_in "Name", with: @food.name
    fill_in "Prabhava special action", with: @food.prabhava_special_action
    fill_in "Rasa taste", with: @food.rasa_taste
    fill_in "Recommendation", with: @food.recommendation
    fill_in "Samskara preparation", with: @food.samskara_preparation
    fill_in "Samyoga combination", with: @food.samyoga_combination
    fill_in "Vipaka post digestive effect", with: @food.vipaka_post_digestive_effect
    fill_in "Virya potency", with: @food.virya_potency
    click_on "Update Food"

    assert_text "Food was successfully updated"
    click_on "Back"
  end

  test "should destroy Food" do
    visit food_url(@food)
    click_on "Destroy this food", match: :first

    assert_text "Food was successfully destroyed"
  end
end
