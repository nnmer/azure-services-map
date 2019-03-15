const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      modules: [
        __dirname,
        'node_modules'
      ],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        'src': path.resolve('src')
      }
    }
  }
}
