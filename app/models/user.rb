class User < ApplicationRecord
  has_secure_password

  has_many :sessions, dependent: :destroy
  has_many :quiz_entries, dependent: :destroy
  has_many :assessment_entries, dependent: :destroy
  belongs_to :prakruti, class_name: 'Dosha', optional: true
  belongs_to :vikruti, class_name: 'Dosha', optional: true
  normalizes :email_address, with: ->(e) { e.strip.downcase }

  # 1. The "getter" method for the virtual attribute "full_name", lets you call `user.full_name`
  def full_name
    "#{first_name} #{last_name}".strip
  end

  # 2. The "setter" method for the virtual attribute, lets you do `user.full_name = "John Doe"` in a form or controller.
  def full_name=(name)
    # self.first_name and self.last_name are the REAL attributes that map to the database columns.
    self.first_name, self.last_name = name.to_s.split(" ", 2)
  end

end
