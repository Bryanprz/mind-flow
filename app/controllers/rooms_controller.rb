class RoomsController < ApplicationController
  before_action :set_room, only: [:show]
  before_action :ensure_room_membership, only: [:show]
  
  def index
    @rooms = Room.public_rooms.includes(:users, :messages)
    @room = Room.new
  end
  
  def private_index
    # Get all rooms where the user is a participant (both private and public)
    # Order by most recent activity (last message or room update)
    @user_rooms = Current.user.rooms
                          .includes(:users, :messages)
                          .order(updated_at: :desc)
  end
  
  def show
    Rails.logger.info "🚀 ROOMS CONTROLLER SHOW ACTION CALLED - #{Time.current}"
    
    # Load all messages in chronological order to ensure all recent messages are shown
    @messages = @room.messages.includes(:user).order(created_at: :asc)
    
    Rails.logger.info "📱 Loading messages for room #{@room.id}:"
    Rails.logger.info "📱 Total messages in room: #{@room.messages.count}"
    Rails.logger.info "📱 Messages loaded: #{@messages.count}"
    Rails.logger.info "📱 Messages with attachments: #{@messages.count { |m| m.attachments.attached? }}"
    Rails.logger.info "📱 Message IDs: #{@messages.pluck(:id)}"
    Rails.logger.info "📱 Message details:"
    @messages.each do |msg|
      Rails.logger.info "📱   - ID: #{msg.id}, User: #{msg.user.name}, Content: #{msg.content.present? ? 'present' : 'empty'}, Attachments: #{msg.attachments.count}, Created: #{msg.created_at}"
    end
    
    # Check for very recent messages
    recent_messages = @room.messages.where('created_at > ?', 1.hour.ago)
    Rails.logger.info "📱 Recent messages (last hour): #{recent_messages.count}"
    recent_messages.each do |msg|
      Rails.logger.info "📱   - Recent ID: #{msg.id}, Created: #{msg.created_at}, User: #{msg.user.name}"
    end
    
    @message = Message.new
    @other_user = @room.other_user(Current.user) if @room.room_type == 'private'
    @has_more_messages = false
    
    # Temporarily disable HTTP caching to test message loading
    # fresh_when @messages
    
    # Force no caching to ensure fresh content
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    response.headers['Last-Modified'] = Time.now.httpdate
  end
  
  def load_more_messages
    Rails.logger.info "🔄 Loading more messages for room #{params[:id]}, last_message_id: #{params[:last_message_id]}"
    
    @room = Room.find(params[:id])
    last_message_id = params[:last_message_id]
    
    # Load older messages before the last message (load 30 for better efficiency)
    @older_messages = @room.messages
                          .with_author_and_attachments
                          .where('id < ?', last_message_id)
                          .recent
                          .limit(30)
    
    @has_more_messages = @room.messages.where('id < ?', last_message_id).count > 30
    
    Rails.logger.info "🔄 Found #{@older_messages.count} older messages, has_more: #{@has_more_messages}"
    
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.prepend(
          "messages",
          partial: "messages/message",
          collection: @older_messages.reverse,
          locals: { message: nil }
        )
      end
    end
  end
  
  def create
    @room = Room.new(room_params)
    @room.users << Current.user
    
    if @room.save
      redirect_to @room, notice: "Room created successfully!"
    else
      render :index, status: :unprocessable_entity
    end
  end
  
  def create_private
    other_user = User.find(params[:user_id])
    
    # Debug logging
    Rails.logger.info "🔍 Looking for existing private room between #{Current.user.name} and #{other_user.name}"
    
    # Check if private room already exists
    existing_room = Current.user.private_rooms_with(other_user).first
    
    Rails.logger.info "🔍 Found existing room: #{existing_room&.id}"
    Rails.logger.info "🔍 Current user's private rooms: #{Current.user.rooms.where(room_type: 'private').pluck(:id)}"
    Rails.logger.info "🔍 Other user's private rooms: #{other_user.rooms.where(room_type: 'private').pluck(:id)}"
    
    if existing_room
      Rails.logger.info "🔍 Redirecting to existing room: #{existing_room.id}"
      redirect_to existing_room
    else
      Rails.logger.info "🔍 Creating new private room"
      @room = Room.create!(
        name: "Private chat with #{other_user.name}",
        room_type: 'private',
        users: [Current.user, other_user]
      )
      redirect_to @room, notice: "Private chat started!"
    end
  end
  
  private
  
  def set_room
    @room = Room.find(params[:id])
  end
  
  def ensure_room_membership
    unless @room.users.include?(Current.user)
      redirect_to rooms_path, alert: "You don't have access to this room."
    end
  end
  
  def room_params
    params.require(:room).permit(:name, :description)
  end
end
