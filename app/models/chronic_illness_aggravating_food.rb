class ChronicIllnessAggravatingFood < ApplicationRecord
  belongs_to :chronic_illness
  belongs_to :food
end
