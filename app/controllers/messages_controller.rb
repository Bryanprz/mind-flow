class MessagesController < ApplicationController
  def create
    @room = Room.find(params[:room_id])
    @message = @room.messages.build(message_params)
    @message.user = Current.user
    
    respond_to do |format|
      if @message.save
        # Broadcasting now happens automatically via the model callback
        format.turbo_stream do
          # Only reset form for sender
          render turbo_stream: turbo_stream.update(
            "message_form",
            partial: "messages/form",
            locals: { message: Message.new, room: @room }
          )
        end
        format.html { redirect_to @room }
      else
        format.turbo_stream do
          render turbo_stream: turbo_stream.update(
            "message_form",
            partial: "messages/form",
            locals: { message: @message, room: @room }
          )
        end
        format.html { render :show }
      end
    end
  end
  
  private
  
  def message_params
    params.require(:message).permit(:content, attachments: [])
  end
end
