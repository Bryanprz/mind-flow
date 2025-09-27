class Newsletter < ApplicationRecord
  normalizes :email_address, with: ->(e) { e.strip.downcase }
  validates :email_address, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :status, inclusion: { in: %w[subscribed unsubscribed] }
  
  scope :active, -> { where(active: true) }
  scope :subscribed, -> { where(status: 'subscribed') }
  
  def subscribe!
    update!(status: 'subscribed', active: true, subscribed_at: Time.current)
  end
  
  def unsubscribe!
    update!(status: 'unsubscribed', active: false)
  end
  
  def subscribed?
    status == 'subscribed'
  end
end
