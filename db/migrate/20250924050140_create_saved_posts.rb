class CreateSavedPosts < ActiveRecord::Migration[8.0]
  def change
    create_table :saved_posts do |t|
      t.references :user, null: false, foreign_key: true
      t.references :social_post, null: false, foreign_key: true
      t.timestamps
      
      t.index [:user_id, :social_post_id], unique: true
    end
    
    # Add counter column to social_posts
    add_column :social_posts, :saves_count, :integer, default: 0
  end
end
