/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Use absolute paths from Rails root - this works in Docker
    "./app/views/**/*.html.erb",
    "./app/helpers/**/*.rb", 
    "./app/components/**/*.{rb,html.erb}",
    "./app/assets/stylesheets/**/*.css",
    "./app/javascript/**/*.js",
    
    // Alternative syntax that sometimes works better in Docker
    "/rails/app/views/**/*.html.erb",
    "/rails/app/helpers/**/*.rb"
  ],
  
  // Add safelist for problematic utilities
  safelist: [
    // Spacing utilities that commonly break
    {
      pattern: /^(w|h|p|m|mt|mb|ml|mr|pt|pb|pl|pr|px|py)-\d+$/,
    },
    // Common utilities
    'w-4', 'h-4', 'p-4', 'm-4', 'mt-20', 'text-sm', 'bg-red-500'
  ]
}
