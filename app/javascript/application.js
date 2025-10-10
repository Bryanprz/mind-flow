// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "turbo_stream_actions"


// Set a cookie with the browser's time zone once, so the server can render dates in the user's zone
// This will be sent with every subsequent request and used in ApplicationController#set_time_zone
(() => {
  const hasTzCookie = document.cookie.match(/(?:^|; )time_zone=/);
  if (!hasTzCookie) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.cookie = `time_zone=${timeZone}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }
})();
