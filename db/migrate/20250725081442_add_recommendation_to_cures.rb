class AddRecommendationToCures < ActiveRecord::Migration[8.0]
  def change
    add_column :cures, :recommendation, :text
  end
end
