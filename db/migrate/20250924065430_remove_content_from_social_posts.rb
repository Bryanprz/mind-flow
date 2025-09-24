class RemoveContentFromSocialPosts < ActiveRecord::Migration[8.0]
  def change
    remove_column :social_posts, :content, :text
  end
end
