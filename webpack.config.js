var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  entry: './views/react_component/01_helloWorld/helloWorld_main.js',
  output: { path: __dirname, filename: './views/output/01_helloWorld/bundle.js' },
  module: {
    loaders: [
        { test: /\.js?$/, loaders: ['babel'], exclude: /node_modules/ },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
        { test: /\.css$/, loader: "style!css" },
        {test: /\.less/,loader: 'style-loader!css-loader!less-loader'}
    ]
  },
};