// const prefixer = require('postcss-prefix-selector');

module.exports = {
  transpileDependencies: [
    'vuetify',
    'vue-tel-input-vuetify'
  ],
  productionSourceMap: false,
  filenameHashing: true,
  publicPath: '/',
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');

    // Ingrore the modules to be packed
    config.externals({
      'moment': 'moment'
    })
  },
  // configureWebpack: {
  //   optimization: {
  //     splitChunks: {
  //       cacheGroups: {
  //         vueTelInput: {
  //           test: /[\\/]node_modules[\\/](vue-tel-input-vuetify|awesome-phonenumber|whatwg-fetch)[\\/]/,
  //           name: 'vuetify-tel-input',
  //           chunks: 'initial'
  //         }
  //       }
  //     },
  //   }
  // },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://10.10.120.246:44326',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
