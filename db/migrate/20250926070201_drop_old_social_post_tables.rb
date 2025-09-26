class DropOldSocialPostTables < ActiveRecord::Migration[8.0]
  def change
    drop_table :social_post_likes, if_exists: true
    drop_table :social_post_replies, if_exists: true
    drop_table :saved_posts, if_exists: true
  end
end
