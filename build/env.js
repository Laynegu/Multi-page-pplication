'use strict'

const path = require('path')
/*
 * 环境列表，第一个环境为默认环境
 * envName: 指明现在使用的环境
 * dirName: 打包的路径，只在build的时候有用
 * baseUrl: 这个环境下面的api 请求的域名
 * assetsPublicPath: 静态资源存放的域名，未指定则使用相对路径
 * */
const ENV_LIST = [
  {
    //开发环境
    envName: 'development',
    dirName: '',
    baseUrl: '',
    assetsPublicPath: '/'
  },
  {
    //测试环境
    envName: 'test',
    dirName: path.resolve(__dirname, '../dist'),
    baseUrl: '',
    assetsPublicPath: '/'
  },
  {
    //生产环境（命令行参数（process.arg）中prod是保留字，所以使用pro）
    envName: 'production',
    dirName: path.resolve(__dirname, '../dist'),
    baseUrl: '',
    assetsPublicPath: '/'
  },

]

let envName = process.env.NODE_ENV;
process.env.BASE_URL = ENV_LIST.find(item => item.envName === envName).baseUrl;
