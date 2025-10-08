import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'

console.log('Vite config loading...')
console.log('React plugin disabled for debugging')

export default defineConfig({
  plugins: [
    RubyPlugin(),
  ],
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
    logLevel: 'info',
  },
})