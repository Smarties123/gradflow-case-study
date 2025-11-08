const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');  // Add this
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables from .env (if present) and merge with process.env
// Only expose public, client-safe keys to the bundle to avoid leaking secrets.
const result = dotenv.config();
const fileEnv = (result && result.parsed) || {};

// Allowlist of keys that are safe to expose to the client
const isPublicKey = (key) => key.startsWith('REACT_APP_') || key === 'STRIPE_PUBLISHABLE_KEY';

// Build a plain object we will assign to process.env at compile time
const publicEnv = {};

Object.keys(fileEnv)
  .filter(isPublicKey)
  .forEach((key) => {
    publicEnv[key] = fileEnv[key];
  });

Object.keys(process.env)
  .filter(isPublicKey)
  .forEach((key) => {
    publicEnv[key] = process.env[key];
  });

// Always include NODE_ENV for libraries that branch on it
publicEnv.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  entry: './src/index.tsx',
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  devServer: {
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    allowedHosts: 'all',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              publicPath: '/',
            },
          },
        ],
      },
      {
        test: /\.(less|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlwebpackPlugin({
      title: 'GradFlow',
      filename: 'index.html',
      template: path.resolve(__dirname, 'public', 'index.html'),
      inject: true,
      hash: true,
      path: './',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(publicEnv)
    }),

    // now copy everything in public/ (except index.html) into build/
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: '', // relative to output.path (build/)
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    }),
  ],
};
