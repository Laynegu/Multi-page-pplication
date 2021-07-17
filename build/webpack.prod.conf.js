const path = require('path');
const { merge } = require("webpack-merge");

const webpackConfigBase = require('./webpack.base.conf');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const webpackConfigProd = {
  mode: 'production', // 通过 mode 声明生产环境

  output: {
    path: path.resolve(__dirname, '../dist'),
    // 打包多出口文件
    filename: 'js/[name]_[hash].js',
    publicPath: './',
    clean: true
  },
  
  devtool: 'eval-cheap-module-source-map',

  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name]_[hash].css',
      chunkFilename: 'css/[name]_[hash].chunk.css',
      ignoreOrder: true,        // 忽略有关顺序冲突的警告
    })
  ],

  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: [  // loader解析的顺序是从下到上，从右到左的顺序
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // 'style-loader',  使用MiniCssExtractPlugin时就不能使用style-loader了
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,   //该方式可以让@import引入的css文件再次执行一边css打包loader
              esModule: false
            }
          },
          'less-loader',
        ]
      }
    ]
  },

  optimization: {
    minimizer: [
      `...`,   // extend existing minimizers (i.e. `terser-webpack-plugin`)
      new CssMinimizerPlugin({
        parallel: true  // 开启多进程并发执行，默认 os.cpus().length - 1
      }),
    ],
  },

  cache: false

}

module.exports = merge(webpackConfigBase, webpackConfigProd);
