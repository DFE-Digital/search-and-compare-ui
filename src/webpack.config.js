const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('application.css');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: { 'application': './Assets/app.js' },
  output: {
    path: path.resolve(__dirname, 'wwwroot'),
    publicPath: '/'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          compress: {
            ie8: true,
            warnings: false
          },
          mangle: {
            ie8: true
          },
          output: {
            comments: false,
            ie8: true
          }
        }
      })
    ]
  },
  plugins: [
    new ExtractTextPlugin('application.css'),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ],
  module: {
    rules: [
      { test: /\.scss$/, use: ExtractTextPlugin.extract({ use: [{loader: 'css-loader',options: {minimize: true}},'sass-loader']})},
      { test: /\.js?$/, exclude: /node_modules/, use: { loader: 'babel-loader', options: {presets: ['es2015']}} }
    ]
  }
};
