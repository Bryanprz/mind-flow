const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './public/*.html',
    './app/helpers/**/*.rb',
    './app/javascript/**/*.js',
    './app/views/**/*.{erb,haml,html,slim}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    require('daisyui'),
  ],
  daisyui: {
    // themes: ["light", "dark", "cupcake", "forest", "silk", "lemonade"],
    themes: [
      "light",
      "dark", 
      {
        "lemonade": {
          "color-scheme": "light",
          "base-100": "oklch(98.71% 0.02 123.72)",
          "base-200": "#e8f2db",
          "base-300": "oklch(84.89% 0.017 123.72)",
          "base-content": "oklch(19.742% 0.004 123.72)",
          "primary": "oklch(58.92% 0.199 134.6)",
          "primary-content": "oklch(11.784% 0.039 134.6)",
          "secondary": "oklch(77.75% 0.196 111.09)",
          "secondary-content": "oklch(15.55% 0.039 111.09)",
          "accent": "oklch(85.39% 0.201 100.73)",
          "accent-content": "oklch(17.078% 0.04 100.73)",
          "neutral": "oklch(30.98% 0.075 108.6)",
          "neutral-content": "oklch(86.196% 0.015 108.6)",
          "info": "oklch(86.19% 0.047 224.14)",
          "info-content": "oklch(17.238% 0.009 224.14)",
          "success": "oklch(86.19% 0.047 157.85)",
          "success-content": "oklch(17.238% 0.009 157.85)",
          "warning": "oklch(86.19% 0.047 102.15)",
          "warning-content": "oklch(17.238% 0.009 102.15)",
          "error": "oklch(86.19% 0.047 25.85)",
          "error-content": "oklch(17.238% 0.009 25.85)",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem"
        }
      }
    ],
    defaultTheme: "lemonade",
    logs: true
  },
  safelist: [
    'alert-success',
    'grid-cols-3',
    'grid-cols-4',
    'grid-cols-5',
    'grid-cols-6',
    'line-through',
    'gap-9',
    'gap-20',
    'w-32',
    'w-36',
    'w-40',
    {
      pattern: /(alert|btn|badge|text|bg)-(success|error|warning|info|primary|secondary|accent|neutral)/,
    },
  ]
}
