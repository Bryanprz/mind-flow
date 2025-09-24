class RemoveContentFromSocialPostReplies < ActiveRecord::Migration[8.0]
  def change
    remove_column :social_post_replies, :content, :text
  end
end
