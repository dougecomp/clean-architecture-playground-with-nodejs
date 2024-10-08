import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    include: ['src/**/*.{spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
})