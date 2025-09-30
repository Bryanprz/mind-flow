class InvalidateRoomCachesJob < ApplicationJob
  queue_as :default

  def perform(room_id)
    Rails.cache.delete("room_#{room_id}_message_count")
    Rails.cache.delete("room_#{room_id}_last_message")
    
    # Invalidate unread counts for all room members
    room = Room.find(room_id)
    room.users.each do |user|
      Rails.cache.delete("room_#{room_id}_unread_#{user.id}")
    end
  end
end
