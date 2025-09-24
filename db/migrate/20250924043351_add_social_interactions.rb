class AddSocialInteractions < ActiveRecord::Migration[8.0]
  def change
    # Create likes table
    create_table :social_post_likes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :social_post, null: false, foreign_key: true
      t.timestamps
      
      t.index [:user_id, :social_post_id], unique: true
    end
    
    # Create replies table
    create_table :social_post_replies do |t|
      t.references :user, null: false, foreign_key: true
      t.references :social_post, null: false, foreign_key: true
      t.text :content, null: false
      t.timestamps
    end
    
    # Add counter columns to social_posts
    add_column :social_posts, :likes_count, :integer, default: 0
    add_column :social_posts, :replies_count, :integer, default: 0
  end
end
