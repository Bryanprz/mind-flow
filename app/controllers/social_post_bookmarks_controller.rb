class SocialPostBookmarksController < ApplicationController
  before_action :require_authentication
  
  def create
    bookmarkable = find_bookmarkable
    existing_bookmark = SocialPostBookmark.find_by(user: Current.user, bookmarkable: bookmarkable)
    
    if existing_bookmark
      # If bookmark exists, destroy it (unbookmark)
      existing_bookmark.destroy
      saved = false
    else
      # If no bookmark exists, create one (bookmark)
      @bookmark = SocialPostBookmark.create(user: Current.user, bookmarkable: bookmarkable)
      saved = @bookmark.persisted?
    end
    
    render json: { success: true, saved: saved, saves_count: bookmarkable.bookmarks_count }
  end
  
  def destroy
    @bookmark = SocialPostBookmark.find_by(
      user: Current.user,
      bookmarkable: find_bookmarkable
    )
    @bookmark&.destroy
    
    render json: { success: true, saved: false, saves_count: find_bookmarkable.bookmarks_count }
  end
  
  private
  
  def find_bookmarkable
    case params[:bookmarkable_type]
    when 'SocialPost'
      SocialPost.find(params[:bookmarkable_id])
    else
      raise ActiveRecord::RecordNotFound
    end
  end
end
