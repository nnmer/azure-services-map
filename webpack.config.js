const path = require("path");
const resolve = require("path").resolve;
const Dotenv = require('dotenv-webpack');
const autoprefixer = require('autoprefixer');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')

const appEnv = process.env.APP_ENV || 'dev'
const devMode = process.env.APP_ENV === 'dev'
const publicPathRoot = devMode ? '' : '/'

module.exports = {
  entry: [
    __dirname + "/src/index.js"
  ],
  resolve: {
    extensions: [".js", ".jsx"],
    modules: [
      __dirname,
      resolve(__dirname,'node_modules')
    ],
    alias: {
      src: path.resolve(__dirname, 'src/'),
      'react-dom': '@hot-loader/react-dom'
    }
  },

  output: {
    publicPath: publicPathRoot,
    filename: "js/[name]"+(devMode ? '' : '.[hash]')+".js",
    chunkFilename: "js/[name]"+(devMode ? '' : '.[hash]')+".chunk.js",
    crossOriginLoading: "anonymous",
    path: path.resolve(__dirname,'public/')
  },

  module: {
    rules: [
      { test: /[\.js|\.jsx]$/,
        include: [
          resolve('src'),
        ],
        use: {
          loader: "babel-loader"
        },
      },
      {
        test: /\.css$/,
        use: [
          { loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader},
          { loader: 'css-loader', /*options: { publicPath: 'public/assets/dist' }*/ },
          {
            loader: "postcss-loader",
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebook/create-react-app/issues/2677
              postcssOptions: {
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    flexbox: 'no-2009',
                  }),
                ],
              },
              sourceMap: devMode,
            }
          }
        ],
      },
      {
        test: /\.(sass|scss)/,
        use: [
          {
            loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader // creates style nodes from JS strings
          }, {
            loader: "css-loader"
          },{

            loader: "postcss-loader",
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebook/create-react-app/issues/2677
              postcssOptions: {
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    flexbox: 'no-2009',
                  } ),
                ],
              },
              sourceMap: devMode,
            }
          }, {
            loader: "sass-loader",
            options: {
              sourceMap: devMode,
            }
          }, { loader: 'resolve-url-loader',
          // options: {}
        }
      ]
      },
      {
        test: /\.(eot|woff|ttf|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: '[name].[ext]?[contenthash]',
            outputPath: 'fonts/',
            publicPath: /* publicPathRoot+ */'/fonts/'
          }
        }
      },
      {
        test: /src\/icons\//,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: {
          loader: "file-loader",
          options: {
            name: '[name].[ext]?[contenthash]',
            outputPath: 'img/',
            publicPath: /* publicPathRoot+ */'/img/'
          }
        }
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin({
      dangerouslyAllowCleanPatternsOutsideProject: true,
      dry: devMode
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name]' + (devMode ? '' : ".[hash]") + ".css",
      chunkFilename: 'css/[name]' + (devMode ? '' : '.[hash]') + ".chunk.css"
    }),
    new CopyWebpackPlugin({
      patterns: [
        {from: path.resolve(__dirname,'src/public'), to: path.resolve(__dirname,'public')}
      ],
    }),
    new HtmlWebpackPlugin({
      title: 'Azure Services IO',
      appMountIds: ['app'],
      favicon: path.resolve(__dirname, 'src/public/favicon.png'),
      // hash: true,
      mobile: true,
      minify: true,
      inject: false,
      filename: 'index.html',
      template: 'src/index.html',
      googleAnalytics: (!devMode ? {
        trackingId: 'UA-134745718-1'
      } : undefined),
      meta: [
        {name: "twitter:card", content: "summary"},
        {property: "og:url", content: "https://"+(appEnv=='prod' ? '' : (appEnv+'.'))+"azureservices.io"},
        {property: "og:title", content: "Azure Services Reference Map"},
        {property: "og:description", content: "Find how Azure services are interconnected"},
        {property: "og:image", content: "https://"+(appEnv=='prod' ? '' : (appEnv+'.'))+"azureservices.io/img/og-image.png"},
      ]
    }),
    new Dotenv({
      path: './.env.'+appEnv+'.local',
    })
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
  }
};
