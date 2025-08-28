class CreateFoods < ActiveRecord::Migration[8.0]
  def change
    create_table :foods do |t|
      t.string "name"
      t.string "recommendation"
      t.string "contraindication"
      t.text "details"
      t.json "elements", default: []
      t.json "recipes", default: []
      t.integer "rasa_taste"
      t.text "virya_potency"
      t.text "vipaka_post_digestive_effect"
      t.string "prabhava_special_action"
      t.integer "guna_quality"
      t.text "samskara_preparation"
      t.text "habitat_and_source"
      t.integer "form_of_intake"
      t.text "samyoga_combination"
      t.timestamps
    end
  end
end
