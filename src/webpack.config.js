const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  devtool: process.env.NODE_ENV === "development" ? "inline-source-map" : "",
  entry: {
    application: "./Assets/app.js"
  },
  output: {
    path: path.resolve(__dirname, "wwwroot"),
    publicPath: "/"
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
  performance: {
    hints: false
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "application.css"
    }),
    new CopyWebpackPlugin([
      {
        from: "node_modules/govuk-frontend/assets/images",
        to: "images"
      },
      {
        from: "Assets/Images",
        to: "images"
      },
      {
        from: "node_modules/govuk-frontend/assets/fonts",
        to: "fonts"
      },
      {
        from: "node_modules/html5shiv/dist/html5shiv.min.js",
        to: "vendor"
      },
      {
        from: "Assets/Styles/govuk-frontend-ie8.min.css",
        to: "vendor"
      },
      {
        from: "node_modules/govuk-frontend/assets/images/favicon.ico",
        to: "."
      },
      {
        from: "Public/robots.txt",
        to: "."
      }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["es2015"]
          }
        }
      }
    ]
  }
};
