import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const cesiumSource = "node_modules/cesium/Build/Cesium";
const cesiumBaseUrl = "static/cesium";

// https://vite.dev/config/
export default defineConfig({
  define: {
    // 在开发环境下，Cesium 通常能自己找到这些文件（因为它们就在 node_modules/cesium/Build/Cesium/ 目录下）。
    // 但是，当你用 Webpack 进行构建打包后，所有的文件结构都会发生变化，Cesium 就无法自动找到这些文件了，
    // 会导致运行时错误，比如报错 Failed to load WebWorker script。
    CESIUM_BASE_URL: JSON.stringify(cesiumBaseUrl), // 这是配置在打包后告诉cesium资源的路径
  },
  plugins: [vue(),
    // 静态资源复制插件，将node_modules里的文件复制到指定文件位置作为静态资源
    viteStaticCopy({
      targets: [
        {
          src: `${cesiumSource}/Workers`,
          dest: cesiumBaseUrl,
        },
        {
          src: `${cesiumSource}/Assets`,
          dest: cesiumBaseUrl,
        },
        {
          src: `${cesiumSource}/ThirdParty`,
          dest: cesiumBaseUrl,
        },
        {
          src: `${cesiumSource}/Widgets`,
          dest: cesiumBaseUrl,
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: { // 定义变量的用配置注入，样式用main引入
        additionalData: `@import "@/assets/styles/_variables.scss";`
      }
    }
  }
})
