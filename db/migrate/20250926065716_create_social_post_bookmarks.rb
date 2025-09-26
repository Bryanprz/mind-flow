class CreateSocialPostBookmarks < ActiveRecord::Migration[8.0]
  def change
    create_table :social_post_bookmarks do |t|
      t.references :user, null: false, foreign_key: true
      t.references :bookmarkable, polymorphic: true, null: false

      t.timestamps
    end
    
    add_index :social_post_bookmarks, [:user_id, :bookmarkable_type, :bookmarkable_id], unique: true
    add_index :social_post_bookmarks, [:bookmarkable_type, :bookmarkable_id]
  end
end
