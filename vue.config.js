const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  // 打包不生成 *.map 文件
  productionSourceMap: false,
  // 打包文件输出目录
  outputDir: './server/public'
})
