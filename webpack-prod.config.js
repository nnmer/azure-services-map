const WebpackStripLoader = require('strip-loader');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require("webpack");
let devConfig = require('./webpack.config.js');

devConfig.mode = "production";
devConfig.optimization = {
  ...devConfig.optimization,
  nodeEnv:'production',
}

let stripLoader = {
    test: [/\.js$/, /\.es6$/],
    exclude: /node_modules/,
    loader: WebpackStripLoader.loader('console.log', 'console.warn')
};

devConfig.module.rules.push(stripLoader);

prodPlugins = [
  ...devConfig.plugins,
  new webpack.optimize.ModuleConcatenationPlugin(),
  new CompressionPlugin({
    filename: '[path].gz[query]',
    algorithm: 'gzip',
    test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
    threshold: 10240,
    minRatio: 0.8
  })
];

devConfig.plugins = prodPlugins;

module.exports = devConfig;
