/* eslint-env node */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  // ===== 1. ENTRY & OUTPUT =====
  entry: './src/index.js',          // <‑‑ adjust if your entry differs
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,                     // clears /dist before each build
  },

  // ===== 2. RESOLVE =====
  resolve: {
    extensions: ['.js', '.jsx'],     // import Foo from './Foo' (no ext)
    alias: {
      stream: 'readable-stream', // ✅ this is critical
    },
    fallback: {                      // Node‑core polyfills for browser
      // crypto:  require.resolve('crypto-browserify'),
      // stream:  require.resolve('stream-browserify'),
      // buffer:  require.resolve('buffer'),
      // process: require.resolve('process/browser'),
      vm: false,
    },
  },

  // ===== 3. MODULE RULES =====
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,         // transpile .js & .jsx
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,              // optional: CSS imports
        use: ['style-loader', 'css-loader'],
      },
      // add asset/file loaders here if needed (images, svgs, etc.)
    ],
    exprContextCritical: false,
  },

  // ===== 4. PLUGINS =====
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      favicon: path.resolve(__dirname, 'public', 'favicon.ico'), // optional
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],  // makes Buffer global
      process: 'process/browser',    // makes process global
    }),
  ],

  // ===== 5. DEV SERVER (optional) =====
  devServer: {
    static: path.resolve(__dirname, 'public'),
    historyApiFallback: true,        // for React Router
    hot: true,
    port: 3000,
    open: true,
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      devServer.app.use((req, res, next) => {
        try {
          decodeURIComponent(req.url);
          next();
        } catch (e) {
          console.error('Malformed URI:', req.url);
          res.statusCode = 400;
          res.end('Bad Request: Malformed URI');
        }
      });
      return middlewares;
    },
  },

  // ===== 6. MODE =====
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: 'source-map',             // good default; remove for prod
  ignoreWarnings: [
    (warning) =>
      warning.message?.includes(
        'require function is used in a way in which dependencies cannot be statically extracted'
      ) && warning.module?.resource?.includes('ethers.min.js'),
  ],
};
