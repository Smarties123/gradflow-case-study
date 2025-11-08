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

const fromFile = Object.keys(fileEnv)
  .filter(isPublicKey)
  .reduce((acc, key) => {
    acc[`process.env.${key}`] = JSON.stringify(fileEnv[key]);
    return acc;
  }, {});

const fromProcess = Object.keys(process.env)
  .filter(isPublicKey)
  .reduce((acc, key) => {
    acc[`process.env.${key}`] = JSON.stringify(process.env[key]);
    return acc;
  }, {});

const envKeys = { ...fromFile, ...fromProcess };

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
    new webpack.DefinePlugin(envKeys),

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
