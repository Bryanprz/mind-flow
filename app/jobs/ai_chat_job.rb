class AiChatJob < ApplicationJob
  queue_as :default

  def perform(question)
    # Call the AI service to get the answer
    chat = RubyLLM.chat(provider: 'ollama')
    response = chat.ask(question)
    answer = response.content

    # Broadcast a Turbo Stream to replace the "thinking" indicator with the answer.
    Turbo::StreamsChannel.broadcast_replace_to(
      "ai_chat",
      target: "thinking_indicator",
      partial: "ai/answer",
      locals: { answer: answer }
    )
  end
end
