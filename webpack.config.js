var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    breathe: './app.js',
  },
  output: {
    path: './',
    filename: './bundle.js',
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
      // Avoid publishing files when compilation fails
      new webpack.NoErrorsPlugin()
  ],
  stats: {
      // Nice colored output
      colors: true
  },
  debug: true,
  node: {
    fs: 'empty'
  }
};