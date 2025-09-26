class AddParentPostToSocialPosts < ActiveRecord::Migration[8.0]
  def change
    add_reference :social_posts, :parent_post, null: true, foreign_key: { to_table: :social_posts }
    # Index is automatically created by add_reference
  end
end
