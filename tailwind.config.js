/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/views/**/*.html.erb',
    './app/helpers/**/*.rb',
    './app/assets/stylesheets/**/*.css',
    './app/components/**/*.{rb,html.erb}',
    './app/javascript/**/*.js'
  ],
  
  // This is the official solution from Rails team
  safelist: [
    // Include all common spacing utilities
    {
      pattern: /^(w|h|p|m|mt|mb|ml|mr|pt|pb|pl|pr|px|py|mx|my)-(\d+|auto|full|screen)$/,
    },
    // Include all text utilities  
    {
      pattern: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
    },
    // Include all background utilities
    {
      pattern: /^bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(\d+)$/,
    }
  ]
}
