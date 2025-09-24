class SocialPostLike < ApplicationRecord
  belongs_to :user
  belongs_to :social_post
  
  validates :user_id, uniqueness: { scope: :social_post_id }
end
