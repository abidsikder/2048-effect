import { defineConfig } from 'vite'

export default defineConfig({
  // sets URLs to be relative
  base: '',
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

