class SocialPost < ApplicationRecord
  belongs_to :user
  has_rich_text :content
  has_many_attached :media
  has_many :social_post_likes, dependent: :destroy
  has_many :social_post_replies, dependent: :destroy
  has_many :saved_posts, dependent: :destroy
  has_many :likers, through: :social_post_likes, source: :user
  has_many :savers, through: :saved_posts, source: :user
  
  def liked_by?(user)
    return false unless user
    social_post_likes.exists?(user: user)
  end
  
  def saved_by?(user)
    return false unless user
    saved_posts.exists?(user: user)
  end
end
