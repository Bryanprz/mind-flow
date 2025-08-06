class AddDescriptionToDiseaseStage < ActiveRecord::Migration[8.0]
  def change
    add_column :disease_stages, :description, :text
  end
end
