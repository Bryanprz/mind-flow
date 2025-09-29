module AvatarHelper
  def avatar_cache_key(user)
    "avatar_#{user.id}_#{user.avatar.attached? ? user.avatar.blob.checksum : 'no_avatar'}"
  end
  
  def cached_avatar_image(user, options = {})
    return default_avatar(user) unless user.avatar.attached?
    
    # Use Rails.cache to avoid repeated database queries
    Rails.cache.fetch(avatar_cache_key(user), expires_in: 1.hour) do
      {
        url: rails_blob_url(user.avatar, disposition: "inline"),
        checksum: user.avatar.blob.checksum
      }
    end
  end
  
  def avatar_image_with_cache(user, css_classes = "w-full h-full object-cover", **options)
    return default_avatar(user) unless user.avatar.attached?
    
    cached_data = cached_avatar_image(user)
    
    image_tag(
      cached_data[:url],
      {
        class: css_classes,
        loading: "eager",
        data: { 
          avatar_loader_target: "avatarImage",
          avatar_cache_key: avatar_cache_key(user),
          user_name: user.name,
          user_id: user.id
        },
        style: "display: block;"
      }.merge(options)
    )
  end
  
  def default_avatar(user)
    content_tag(:div, 
                user.name[0].upcase,
                class: "w-full h-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold",
                data: { avatar_loader_target: "avatarFallback" })
  end
end
