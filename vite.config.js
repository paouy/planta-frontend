import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {
  //         // allocation: ['./src/features/allocation/index.js'],
  //         // category: ['./src/features/category/index.js'],
  //         // customer: ['./src/features/customer/index.js'],
  //         // equipment: ['./src/features/equipment/index.js'],
  //         // fulfillment: ['./src/features/fulfillment/index.js'],
  //         // job: ['./src/features/job/index.js'],
  //         // material: ['./src/features/material/index.js'],
  //         // misc: ['./src/features/misc/index.js'],
  //         // operation: ['./src/features/operation/index.js'],
  //         // operationBatch: ['./src/features/operationBatch/index.js'],
  //         // product: ['./src/features/product/index.js'],
  //         // productionOrder: ['./src/features/productionOrder/index.js'],
  //         // productionRecord: ['./src/features/productionRecord/index.js'],
  //         // productMaterial: ['./src/features/productMaterial/index.js'],
  //         // salesOrder: ['./src/features/salesOrder/index.js'],
  //         // salesOrderItem: ['./src/features/salesOrderItem/index.js'],
  //         // worker: ['./src/features/worker/index.js'],
  //         // workstation: ['./src/features/workstation/index.js'],
  //         views: ['./src/views/index.js']
  //       }
  //     }
  //   }
  // }
})
