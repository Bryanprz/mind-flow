class DoshaAggravatingFood < ApplicationRecord
  belongs_to :dosha
  belongs_to :food, optional: true
  
  # Delegate to food for backward compatibility
  delegate :name, :description, to: :food, allow_nil: true
  
  def name
    food&.name || super
  end
  
  def description
    food&.details || super
  end
end