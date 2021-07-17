const path = require('path');
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const webpackConfigBase = require('./webpack.base.conf');
const ESLintPlugin = require('eslint-webpack-plugin');

const webpackConfigDev = {
  mode: 'development', // 通过 mode 声明开发环境

  output: {
    path: path.resolve(__dirname, '../dist'),
    // 打包多出口文件
    filename: 'js/[name]_[hash].bundle.js',
    clean: true
  },

  devServer: {
    contentBase: path.join(__dirname, "../dist"),
    historyApiFallback: true,    // 解决单页面路由问题
    publicPath: '/',
    host: "127.0.0.1",
    port: "8090",
    overlay: true,    // 浏览器页面上显示错误
    open: true,       // 开启浏览器
    // stats: "errors-only", //stats: "errors-only"表示只打印错误：
    hot: true,        // 开启热更新
  },

  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: [
          // compiles Less to CSS
          'style-loader',
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,   //该方式可以让@import引入的css文件再次执行一边css打包loader
              esModule: true
            }
          },
          'less-loader',
        ],
      }
    ]
  },

  plugins: [
    //热更新
    new webpack.HotModuleReplacementPlugin(),

    new ESLintPlugin({})
  ],

  devtool: "source-map",  // 开启调试模式

  // 缓存生成的 webpack 模块和 chunk，来改善构建速度
  cache: {
    type: 'filesystem',
    maxAge: 60 * 60 * 1000
  },

  optimization: {
    minimize: true,
  },

}

module.exports = merge(webpackConfigBase, webpackConfigDev);
