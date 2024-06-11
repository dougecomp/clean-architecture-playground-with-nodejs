import { mergeConfig } from 'vitest/config'
import defaultConfig from './vitest.config'

export default mergeConfig(defaultConfig, {
  test: {
    include: ['src/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    poolOptions: {
      threads: {
        singleThread: true
      }
    }
  }
})