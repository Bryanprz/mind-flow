class Food < ApplicationRecord
  has_many :chronic_illness_healing_foods, dependent: :destroy
  has_many :chronic_illness_aggravating_foods, dependent: :destroy
  has_many :dosha_healing_foods, dependent: :destroy
  has_many :dosha_aggravating_foods, dependent: :destroy
  
  # Polymorphic associations for ChannelSystem
  has_many :revived_channel_systems, as: :revived_by, class_name: 'ChannelSystem', dependent: :nullify
  has_many :damaged_channel_systems, as: :damaged_by, class_name: 'ChannelSystem', dependent: :nullify
  
  validates :name, presence: true, uniqueness: true
  
  # Use details field as description if needed
  def description
    details
  end
  
  def description=(value)
    self.details = value
  end
end
