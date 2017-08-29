const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /[node_modules|lib]/,
        loader: 'eslint-loader'
      },
      {
        test: /.json$/,
        loaders: [
          'json-loader'
        ]
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: {
            plugins: (loader) => [
              autoprefixer()
            ]
          }},
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'ng-annotate-loader'
        ]
      },
      {
        test: /.html$/,
        loaders: [
          'html-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: conf.path.src('index.html')
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true,
    })
  ],
  node: {
    fs: 'empty'
  },
  devtool: 'source-map',
  output: {
    path: path.join(process.cwd(), conf.paths.tmp),
    filename: 'index.js'
  },
  entry: `./${conf.path.src('index')}`
};
