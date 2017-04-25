var path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [ 'babel-loader' ],
        exclude: [ path.resolve(__dirname, 'node_modules') ]
      }, {
        test: /\.scss$/,
        use: [ 'style-loader', 'css-loader', 'sass-loader' ]
      }
    ]
  }
};