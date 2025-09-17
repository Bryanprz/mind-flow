class CreateSocialPosts < ActiveRecord::Migration[8.0]
  def change
    create_table :social_posts do |t|
      t.text :content
      t.references :user, null: false, foreign_key: true
      t.datetime :published_at

      t.timestamps
    end
  end
end
