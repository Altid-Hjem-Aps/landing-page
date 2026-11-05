import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { readFileSync } from 'fs'
import { createRequire } from 'module'

// Next's bundled image-size (the same parser Next uses for static imports).
const { imageSize } = createRequire(import.meta.url)('next/dist/compiled/image-size') as {
  imageSize: (input: Buffer) => { width?: number; height?: number }
}

// Next turns a static image import into { src, width, height } so next/image
// knows the size; plain Vite gives a URL string. Mirror Next's shape so
// components that import their images (components/forside/img) render in
// jsdom exactly as they do in the app.
function nextStaticImages(): Plugin {
  return {
    name: 'next-static-images',
    enforce: 'pre',
    load(id) {
      const file = id.split('?')[0]
      if (file.includes('node_modules') || !/\.(png|jpe?g|webp|avif|gif)$/.test(file)) return null
      const { width, height } = imageSize(readFileSync(file))
      if (!width || !height) throw new Error(`Cannot read the size of ${file}`)
      const src = '/' + path.relative(__dirname, file)
      return `export default ${JSON.stringify({ src, width, height })}`
    },
  }
}

export default defineConfig({
  plugins: [react(), nextStaticImages()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
