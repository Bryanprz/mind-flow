# config/initializers/turbo_stream_actions.rb
class Turbo::Streams::TagBuilder
  def update_url(url)
    tag.turbo_stream(action: :update_url, url: url)
  end
end