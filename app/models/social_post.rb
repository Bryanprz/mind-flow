class SocialPost < ApplicationRecord
  belongs_to :user
  belongs_to :parent_post, class_name: 'SocialPost', optional: true
  has_many :replies, class_name: 'SocialPost', foreign_key: 'parent_post_id', dependent: :destroy
  
  has_rich_text :content
  has_many_attached :media
  has_many :likes, as: :likeable, dependent: :destroy
  has_many :social_post_bookmarks, as: :bookmarkable, dependent: :destroy
  
  # Scopes
  scope :top_level_posts, -> { where(parent_post_id: nil) }
  scope :replies, -> { where.not(parent_post_id: nil) }
  
  # Instance methods
  def top_level_post?
    parent_post_id.nil?
  end
  
  def reply?
    !top_level_post?
  end
  
  def original_post
    return self if top_level_post?
    parent_post.original_post
  end
  
  # Calculate depth dynamically
  def reply_depth
    return 0 if top_level_post?
    1 + parent_post.reply_depth
  end
  
  # Like/bookmark methods
  def liked_by?(user)
    return false unless user
    likes.exists?(user: user)
  end
  
  def liked_by(user)
    likes.find_by(user: user)
  end
  
  def bookmarked_by?(user)
    return false unless user
    social_post_bookmarks.exists?(user: user)
  end
  
  def bookmarked_by(user)
    social_post_bookmarks.find_by(user: user)
  end
  
  # Count methods
  def likes_count
    likes.count
  end
  
  def bookmarks_count
    social_post_bookmarks.count
  end
  
  def replies_count
    replies.count
  end
end
