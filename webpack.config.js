const path = require("path");
const resolve = require("path").resolve;
const Dotenv = require('dotenv-webpack');
const autoprefixer = require('autoprefixer');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')

const devMode = process.env.NODE_ENV !== 'production'
const publicPathRoot = ''//devMode ? '' : '/app'

module.exports = {
  entry: [
    __dirname + "/src/index.js"
  ],
  resolve: {
    extensions: [".js", ".json", ".jsx"],
    modules: [
      __dirname,
      resolve(__dirname,'node_modules')
    ],
    alias: {
      src: path.resolve(__dirname, 'src/')
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
      { test: /\.json$/,  loader: "json-loader" },
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
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  flexbox: 'no-2009',
                }),
              ],
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
        }, {
          loader: "sass-loader", 
          options: {
            implementation: require('node-sass'),
          },
        }]
      },
      {
        test: /\.(eot|woff|ttf|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: '[name].[ext]?[contenthash]',
            outputPath: 'fonts/',
            publicPath: publicPathRoot+'/fonts/'
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
            publicPath: publicPathRoot+'/img/'
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
    new CopyWebpackPlugin(
      [
        {from: path.resolve(__dirname,'src/public'), to: path.resolve(__dirname,'public')}
      ],
      { debug: 'info' }
    ),
    new HtmlWebpackPlugin({
      title: 'Azure Services',
      appMountIds: ['app','modal-root'],
      favicon: path.resolve(__dirname, 'src/public/favicon.png'),
      // hash: true,
      inject: false,
      filename: 'index.html',
      template: 'src/index.html'
    }),    
    new Dotenv({
      path: './.env.'+process.env.NODE_ENV+'.local',
    })
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
    },
  }
};
