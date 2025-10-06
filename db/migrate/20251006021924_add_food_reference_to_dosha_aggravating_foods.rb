class AddFoodReferenceToDoshaAggravatingFoods < ActiveRecord::Migration[8.0]
  def change
    add_reference :dosha_aggravating_foods, :food, null: true, foreign_key: true
  end
end
