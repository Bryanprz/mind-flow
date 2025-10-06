class ChannelSystem < ApplicationRecord
  belongs_to :revived_by, polymorphic: true, optional: true
  belongs_to :damaged_by, polymorphic: true, optional: true
  
  has_many :chronic_illness_channel_systems, dependent: :destroy
  has_many :chronic_illnesses, through: :chronic_illness_channel_systems
  
  validates :name, presence: true
end
