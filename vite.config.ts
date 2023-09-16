import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const outDir = process.env.BUILD_PATH
const base = process.env.BASE_URL || ''

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base,
    build: {
      outDir,
    },
    define: {
      'import.meta.env.REACT_APP_VOCDONI_ENVIRONMENT': JSON.stringify(env.REACT_APP_VOCDONI_ENVIRONMENT),
      'import.meta.env.REACT_APP_CSP_URL': JSON.stringify(env.REACT_APP_CSP_URL),
      'import.meta.env.REACT_APP_CSP_PUBKEY': JSON.stringify(env.REACT_APP_CSP_PUBKEY),
    },
    plugins: [
      tsconfigPaths(),
      react(),
      nodePolyfills({
        protocolImports: true,
      }),
    ],
  }
})
