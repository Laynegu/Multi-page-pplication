const path = require('path');
const glob = require('glob');
const webpack = require("webpack");
require("./env");

// 解析 .vue 文件
const { VueLoaderPlugin } = require('vue-loader');
// html 模板
const htmlWebpackPlugin = require("html-webpack-plugin");

// 收集入口及相应模板
function getEntryAndTpl() {
  let entry = {}, htmlTplPlugins = [];
  //读取 src 目录所有 page 入口
  glob.sync('src/pages/**/index.[jt]s{,x}').forEach(function (name) {
    let filename = name.split('/')[2];
    entry[filename] = path.join(__dirname, '../' + name);
    htmlTplPlugins.push(new htmlWebpackPlugin({
      template: path.join(__dirname, `../src/pages/${filename}/index.html`),
      filename: `${filename}.html`,
      // favicon: './favicon.ico',
      // title: title,
      inject: true,  // 默认值，script标签位于html文件的 body 底部
      hash: true, //开启hash  ?[hash]
      chunks: ['vendor', filename],
      minify: process.env.NODE_ENV === "development" ? false : {
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: true, //折叠空白区域 也就是压缩代码
        removeAttributeQuotes: true, //去除属性引用
      },
    }))
  });
  return { entry, htmlTplPlugins };
};

module.exports = {
  entry: getEntryAndTpl().entry,

  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true  // 设置缓存
          }
        }
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true, // ? 关闭类型检查，即只进行转译，采用多进程检查提高效率
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // 将 JS 字符串生成为 style 节点
          'style-loader',
          'vue-style-loader',
          // 将 CSS 转化成 CommonJS 模块
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,   //该方式可以让@import引入的css文件再次执行一边css打包loader
              esModule: true
            }
          },
          // 将 Sass 编译成 CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(jpe?g|png|gif|webp)$/,
        use: [
          {
            loader: 'url-loader', // 和file-loader功能相同，但更智能
            options: {
              // 配置打包后的文件名,具体可看webpack的file-loader文档
              name: '[name].[ext]?[hash]',
              outputPath: 'images/',
              limit: 4096 // 当图片大小大于4k时将以文件形式输出，否则以base64输出
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          }
        ]
      },
      // 引入字体，svg等文件
      {
        test: /\.(eot|ttf|svg)$/,
        use: {
          loader: 'file-loader'
        }
      },
      {
        test: /\.vue$/,
        use: [
          'vue-loader'
        ]
      }
    ],
  },

  plugins: [
    ...getEntryAndTpl().htmlTplPlugins,
    // 声明全局变量
    new webpack.DefinePlugin({
      'process.env.BASE_URL': '\"' + process.env.BASE_URL + '\"',
      'process.env.NODE_ENV': '\"' + process.env.NODE_ENV + '\"',
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    new VueLoaderPlugin()
  ],

  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.vue'],
    // 支持别名
    alias: {
      "@": path.join(__dirname, '../src/')
    }
  },

  // 优化项
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      cacheGroups: {
        vendors: {   // 抽离第三方插件
          test: /[\\/]node_modules[\\/]/,   // 指定是node_modules下的第三方包
          chunks: 'initial',
          name: 'vendor',  // 打包后的文件名，任意命名    
          // filename:'[name].bundle.js',
          // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          name: 'common',
          reuseExistingChunk: true // 是否复用已经打包过的代码
        }
      }
    },
    // tree-shaking
    usedExports: true
  }
}
