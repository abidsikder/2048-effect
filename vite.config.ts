import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'esnext'
  },
  plugins: [
    {
      name: 'shader-hmr',
      enforce: 'post',
      // HMR
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.glsl')) {
          console.log('reloading glsl file...');
		  
          server.ws.send({ type: 'full-reload', path: '*' });
        }
      },
    }
  ]
})

