class HabitLog < ApplicationRecord
  belongs_to :user

  def completed_item_ids
    []
  end
end
