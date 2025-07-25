class AddMissingFieldsToCures < ActiveRecord::Migration[8.0]
  def change
    add_column :cures, :details, :text
    add_column :cures, :rasa_taste, :integer
    add_column :cures, :virya_potency, :text
    add_column :cures, :vipaka_post_digestive_effect, :text
    add_column :cures, :prabhava_special_action, :string
    add_column :cures, :guna_quality, :integer
    add_column :cures, :samskara_preparation, :text
    add_column :cures, :habitat_and_source, :text
    add_column :cures, :form_of_intake, :integer
    add_column :cures, :samyoga_combination, :text
    add_column :cures, :elements, :string, array: true, default: []
    add_column :cures, :recipes, :string, array: true, default: []
    remove_column :cures, :recipe, :text
    remove_column :cures, :prevention, :text
  end
end
