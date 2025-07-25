require "test_helper"

class FoodsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @food = foods(:one)
  end

  test "should get index" do
    get foods_url
    assert_response :success
  end

  test "should get new" do
    get new_food_url
    assert_response :success
  end

  test "should create food" do
    assert_difference("Food.count") do
      post foods_url, params: { food: { contraindication: @food.contraindication, details: @food.details, form_of_intake: @food.form_of_intake, guna_quality: @food.guna_quality, habitat_and_source: @food.habitat_and_source, name: @food.name, prabhava_special_action: @food.prabhava_special_action, rasa_taste: @food.rasa_taste, recommendation: @food.recommendation, samskara_preparation: @food.samskara_preparation, samyoga_combination: @food.samyoga_combination, vipaka_post_digestive_effect: @food.vipaka_post_digestive_effect, virya_potency: @food.virya_potency } }
    end

    assert_redirected_to food_url(Food.last)
  end

  test "should show food" do
    get food_url(@food)
    assert_response :success
  end

  test "should get edit" do
    get edit_food_url(@food)
    assert_response :success
  end

  test "should update food" do
    patch food_url(@food), params: { food: { contraindication: @food.contraindication, details: @food.details, form_of_intake: @food.form_of_intake, guna_quality: @food.guna_quality, habitat_and_source: @food.habitat_and_source, name: @food.name, prabhava_special_action: @food.prabhava_special_action, rasa_taste: @food.rasa_taste, recommendation: @food.recommendation, samskara_preparation: @food.samskara_preparation, samyoga_combination: @food.samyoga_combination, vipaka_post_digestive_effect: @food.vipaka_post_digestive_effect, virya_potency: @food.virya_potency } }
    assert_redirected_to food_url(@food)
  end

  test "should destroy food" do
    assert_difference("Food.count", -1) do
      delete food_url(@food)
    end

    assert_redirected_to foods_url
  end
end
