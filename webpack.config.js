const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './client/src/index.jsx'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, './client/dist'),
    filename: 'bundle.js',
  },
};