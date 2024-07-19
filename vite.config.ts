import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({
    insertTypesEntry: true,
    include: ['src/**/*.ts', 'src/**/*.tsx'],
    outDir: 'dist/types',
    tsconfigPath: './tsconfig.build.json'
  })],
  build: {
    lib: {
      entry: 'src/index.tsx', // Change this to your library entry file
      name: 'Cories Portfolio Template',
      formats: ['es', 'umd'],
      fileName: (format) => `cories-portfolio-template.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});