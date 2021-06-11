const { resolve } = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = require('./server/config');

module.exports = {
  mode: "development",
  node: {
    fs: 'empty',
  },

  entry: [
    'react-hot-loader/patch',
    // activate HMR for React

    'webpack-dev-server/client?http://0.0.0.0:' + config.browserSync.port,
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates

    './src/index.jsx',
    // the entry point of our app
  ],
  output: {
    // the output bundle
    filename: 'bundle.js',

    path: resolve(__dirname, 'dist/'),

    //publicPath: '/', // necessary for HMR to know where to load the hot update chunks
    publicPath: '/bvh_visualizer/', // necessary for HMR to know where to load the hot update chunks
  },

  devtool: 'inline-source-map',

  devServer: {
    hot: true, // enable HMR on the server

    contentBase: resolve(__dirname, 'dist/'), // match the output path

    publicPath: '/', // match the output `publicPath`

    host: '0.0.0.0', // work on any protocol, IP, etc

    port: config.browserSync.port,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?name=/fonts/[name].[ext]',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=/fonts/[name].[ext]',
      },
      {
        test: /\.css$/,
        loader: 'style-loader',
      }, {
        test: /\.css$/,
        loader: 'css-loader',
      },
      {
        test: /\.(jpe?g|gif|svg)$/i,
        use: [
          'img-loader?name=images/[name].[ext]',
          'url-loader?name=images/[name].[ext]&limit=10000',
        ],
      },
      {
        test: /\.(png)$/i,
        use: [
          'base64-image-loader',
        ],
      },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    // alias: {
    //   '../osc.js': resolve(__dirname, 'node_modules/osc/src/osc.js'),
    //   'osc-browser': resolve(__dirname, 'node_modules/osc/dist/osc-browser.min.js'),
    // },
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: resolve(__dirname, config.copy.all.src),
        to: resolve(__dirname, './dist/'),
      },
    ]),

    new WebappWebpackPlugin(resolve(__dirname, './src/static/images/op_logo.png')),
    new HtmlWebpackPlugin({
      title: 'Open Perform by Kinetech Arts',
      template: resolve(__dirname, './src/html/index.html'),
    }),

    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      THREE: 'three',
      'window.THREE': 'three',
      TWEEN: 'tween.js',
      'window.TWEEN': 'tween.js',
      React: 'react',
      _: 'lodash',
    })
  ]
};
