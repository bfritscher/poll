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
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ],
  node: {
    fs: 'empty'
  },
  devtool: 'source-map'
};
