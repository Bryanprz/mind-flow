class CreateCures < ActiveRecord::Migration[8.0]
  def change
    create_table :cures do |t|
      t.string :name
      t.string :severity
      t.text :recommendation
      t.text :contraindication
      t.text :details
      t.integer :rasa_taste
      t.text :virya_potency
      t.text :vipaka_post_digestive_effect
      t.string :prabhava_special_action
      t.integer :guna_quality
      t.text :samskara_preparation
      t.text :habitat_and_source
      t.integer :form_of_intake
      t.text :samyoga_combination
      t.json :elements, default: []
      t.json :recipes, default: []
      t.timestamps
    end
  end
end
