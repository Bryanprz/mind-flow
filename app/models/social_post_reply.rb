class SocialPostReply < ApplicationRecord
  belongs_to :user
  belongs_to :social_post
  has_rich_text :content
  has_many_attached :media
  
  validate :content_is_not_just_whitespace
  validates :content, length: { maximum: 5000 }

  private

  def content_is_not_just_whitespace
    # The `to_s` is important in case body is nil
    if !content.body.present? || content.body.to_plain_text.strip.blank?
      errors.add(:content, "can't be blank")
    end
  end
end
