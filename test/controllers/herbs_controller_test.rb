require "test_helper"

class HerbsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @herb = herbs(:one)
  end

  test "should get index" do
    get herbs_url
    assert_response :success
  end

  test "should get new" do
    get new_herb_url
    assert_response :success
  end

  test "should create herb" do
    assert_difference("Herb.count") do
      post herbs_url, params: { herb: { contraindication: @herb.contraindication, details: @herb.details, elements: @herb.elements, form_of_intake: @herb.form_of_intake, guna_quality: @herb.guna_quality, habitat_and_source: @herb.habitat_and_source, name: @herb.name, prabhava_special_action: @herb.prabhava_special_action, rasa_taste: @herb.rasa_taste, recipes: @herb.recipes, recommendation: @herb.recommendation, samskara_preparation: @herb.samskara_preparation, samyoga_combination: @herb.samyoga_combination, vipaka_post_digestive_effect: @herb.vipaka_post_digestive_effect, virya_potency: @herb.virya_potency } }
    end

    assert_redirected_to herb_url(Herb.last)
  end

  test "should show herb" do
    get herb_url(@herb)
    assert_response :success
  end

  test "should get edit" do
    get edit_herb_url(@herb)
    assert_response :success
  end

  test "should update herb" do
    patch herb_url(@herb), params: { herb: { contraindication: @herb.contraindication, details: @herb.details, elements: @herb.elements, form_of_intake: @herb.form_of_intake, guna_quality: @herb.guna_quality, habitat_and_source: @herb.habitat_and_source, name: @herb.name, prabhava_special_action: @herb.prabhava_special_action, rasa_taste: @herb.rasa_taste, recipes: @herb.recipes, recommendation: @herb.recommendation, samskara_preparation: @herb.samskara_preparation, samyoga_combination: @herb.samyoga_combination, vipaka_post_digestive_effect: @herb.vipaka_post_digestive_effect, virya_potency: @herb.virya_potency } }
    assert_redirected_to herb_url(@herb)
  end

  test "should destroy herb" do
    assert_difference("Herb.count", -1) do
      delete herb_url(@herb)
    end

    assert_redirected_to herbs_url
  end
end
