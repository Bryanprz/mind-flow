class AddGeneralRecommendationsToDoshas < ActiveRecord::Migration[8.0]
  def change
    add_column :doshas, :general_recommendations, :text
  end
end
