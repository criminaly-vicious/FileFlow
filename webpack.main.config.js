const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/main/main.js',
  target: 'electron-main',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  }
};