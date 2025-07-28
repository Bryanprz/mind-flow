class User < ApplicationRecord
  has_many :quiz_entries
  belongs_to :prakruti, class_name: 'Dosha', optional: true
  belongs_to :vikruti, class_name: 'Dosha', optional: true

  def name
    "#{first_name} #{last_name}"
  end
end
