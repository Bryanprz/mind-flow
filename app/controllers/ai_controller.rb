class AiController < ApplicationController
  def ask
    # Use RubyLLM's unified chat API with Ollama
    chat = RubyLLM.chat(provider: 'ollama')

    # Ask a coding question
    response = chat.ask("Write a Ruby method that reverses a string.")

    render plain: response.content
  end
end
