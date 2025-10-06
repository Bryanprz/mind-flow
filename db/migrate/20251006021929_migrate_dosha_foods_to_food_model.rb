class MigrateDoshaFoodsToFoodModel < ActiveRecord::Migration[8.0]
  def up
    # Migrate DoshaHealingFood data to Food model
    DoshaHealingFood.find_each do |dosha_food|
      food = Food.find_or_create_by(name: dosha_food.name) do |f|
        f.details = dosha_food.description
        f.recommendation = dosha_food.recommendations
      end
      dosha_food.update_column(:food_id, food.id)
    end
    
    # Migrate DoshaAggravatingFood data to Food model
    DoshaAggravatingFood.find_each do |dosha_food|
      food = Food.find_or_create_by(name: dosha_food.name) do |f|
        f.details = dosha_food.description
        f.contraindication = dosha_food.recommendations
      end
      dosha_food.update_column(:food_id, food.id)
    end
  end
  
  def down
    # Remove food references
    DoshaHealingFood.update_all(food_id: nil)
    DoshaAggravatingFood.update_all(food_id: nil)
  end
end
