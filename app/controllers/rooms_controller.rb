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
    # Load only recent messages (last 10) for ultra-fast initial page load
    @messages = @room.messages.with_author_and_attachments.recent.limit(10)
    @message = Message.new
    @other_user = @room.other_user(Current.user) if @room.room_type == 'private'
    @has_more_messages = @room.messages.count > 10
    
    # Add HTTP caching - if messages haven't changed, return 304 Not Modified
    fresh_when @messages
  end
  
  def load_more_messages
    @room = Room.find(params[:id])
    last_message_id = params[:last_message_id]
    
    # Load older messages before the last message (load 30 for better efficiency)
    @older_messages = @room.messages
                          .with_author_and_attachments
                          .where('id < ?', last_message_id)
                          .recent
                          .limit(30)
    
    @has_more_messages = @room.messages.where('id < ?', last_message_id).count > 30
    
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
