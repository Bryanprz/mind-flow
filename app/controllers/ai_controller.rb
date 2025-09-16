class AiController < ApplicationController
  def ask
    @question = params[:question]
    AiChatJob.perform_later(@question)
    # This will implicitly render app/views/ai/ask.turbo_stream.erb
  end
end
