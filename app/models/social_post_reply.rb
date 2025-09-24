class SocialPostReply < ApplicationRecord
  belongs_to :user
  belongs_to :social_post
  has_rich_text :content
  
  validates :content, presence: true, length: { maximum: 500 }
end
