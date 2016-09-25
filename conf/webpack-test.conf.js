module.exports = {
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /[node_modules|lib]/,
        loader: 'eslint'
      }
    ],

    loaders: [
      {
        test: /.json$/,
        loaders: [
          'json'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'ng-annotate'
        ]
      },
      {
        test: /.html$/,
        loaders: [
          'html'
        ]
      }
    ]
  },
  plugins: [],
  node: {
    fs: 'empty'
  },
  debug: true,
  devtool: 'source-map'
};
