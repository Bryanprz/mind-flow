require "test_helper"

class CuresControllerTest < ActionDispatch::IntegrationTest
  setup do
    @cure = create(:cure)
  end

  test "should get index" do
    get cures_url
    assert_response :success
  end

  test "should get new" do
    get new_cure_url
    assert_response :success
  end

  test "should create cure" do
    assert_difference("Cure.count") do
      post cures_url, params: { cure: { contraindication: @cure.contraindication, details: @cure.details, elements: @cure.elements, form_of_intake: @cure.form_of_intake, guna_quality: @cure.guna_quality, habitat_and_source: @cure.habitat_and_source, name: @cure.name, prabhava_special_action: @cure.prabhava_special_action, rasa_taste: @cure.rasa_taste, recipes: @cure.recipes, recommendation: @cure.recommendation, samskara_preparation: @cure.samskara_preparation, samyoga_combination: @cure.samyoga_combination, vipaka_post_digestive_effect: @cure.vipaka_post_digestive_effect, virya_potency: @cure.virya_potency } }
    end

    assert_redirected_to cure_url(Cure.last)
  end

  test "should show cure" do
    get cure_url(@cure)
    assert_response :success
  end

  test "should get edit" do
    get edit_cure_url(@cure)
    assert_response :success
  end

  test "should update cure" do
    patch cure_url(@cure), params: { cure: { name: @cure.name, severity: @cure.severity, recommendation: @cure.recommendation, contraindication: @cure.contraindication, details: @cure.details, rasa_taste: @cure.rasa_taste, virya_potency: @cure.virya_potency, vipaka_post_digestive_effect: @cure.vipaka_post_digestive_effect, prabhava_special_action: @cure.prabhava_special_action, guna_quality: @cure.guna_quality, samskara_preparation: @cure.samskara_preparation, habitat_and_source: @cure.habitat_and_source, form_of_intake: @cure.form_of_intake, samyoga_combination: @cure.samyoga_combination, elements: @cure.elements, recipes: @cure.recipes } }
    assert_redirected_to cure_url(@cure)
  end

  test "should destroy cure" do
    assert_difference("Cure.count", -1) do
      delete cure_url(@cure)
    end

    assert_redirected_to cures_url
  end
end
