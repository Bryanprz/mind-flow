RubyLLM.configure do |config|
  config.ollama_api_base = 'http://localhost:11434/v1'
  config.default_model = 'deepseek-coder-v2:16b'
end
