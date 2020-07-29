const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 配置全局样式变量
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/bpmn-modeler/' : '/',
  outputDir: 'docs',
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
      .set('views', resolve('src/views'))
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    proxy: 'http://localhost:9527'
  }
}
