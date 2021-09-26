const WebpackStripLoader = require('strip-loader');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require("webpack");
let devConfig = require('./webpack.config.js');

devConfig.mode = "production";
devConfig.optimization = {
  ...devConfig.optimization,
  nodeEnv:'production',
  minimize: true,
}

let stripLoader = {
    test: [/\.js$/, /\.es6$/],
    exclude: /node_modules/,
    use: {
      loader: WebpackStripLoader.loader('console.log', 'console.warn')
    }
};

devConfig.module.rules.push(stripLoader);

prodPlugins = [
  ...devConfig.plugins,
  new CompressionPlugin({
    filename: '[path][base].gz[query]',
    algorithm: 'gzip',
    test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
    threshold: 10240,
    minRatio: 0.8
  })
];

devConfig.plugins = prodPlugins;

module.exports = devConfig;
