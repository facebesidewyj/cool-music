'use strict';
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');
const axios = require('axios');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    // axios通过node发送https请求欺骗服务器
    before(app) {
      // 获得推荐歌单
      app.get('/api/getDiscList', function(req, res) {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data);
        }).catch((e) => {
          console.log(e);
        });
      });

      // 获得轮播图数据
      app.get('/api/getRecommend', function(req, res) {
        const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data);
        }).catch((e) => {
          console.log(e);
        });
      });

      // 获得歌手列表数据
      app.get('/api/getSingers', function(req, res) {
        const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data);
        }).catch((e) => {
          console.log(e);
        });
      });

      // 获得歌手对应的歌曲列表
      app.get('/api/getSingerSongs', function(req, res) {
        const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data);
        }).catch((e) => {
          console.log(e);
        });
      });

      // 获取合法的播放权限
      app.get('/api/getVKey', function(req, res) {
        const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data);
        }).catch((e) => {
          console.log(e);
        });
      });

      // 获取歌词
      app.get('/api/getLyric', function(req, res) {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          let ret = response.data;
          console.log(response);
          if (typeof ret === 'string') {
            const reg = /^\w+\(({.+})\)$/;
            const matches = ret.match(reg);
            if (matches) {
              ret = JSON.parse(matches[1]);
            }
          }
          res.json(ret);
        }).catch((e) => {
          console.log(e);
        });
      });

      // 获取歌单详情
      app.get('/api/getDiscDetail', function(req, res) {
        const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          let ret = response.data;
          if (typeof ret === 'string') {
            const reg = /^\w+\(({.+})\)$/;
            const matches = ret.match(reg);
            if (matches) {
              ret = JSON.parse(matches[1]);
            }
          }
          res.json(ret);
        }).catch((e) => {
          console.log(e);
        });
      });

      // 获取榜单列表
      app.get('/api/getRankList', function(req, res) {
        const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          let ret = response.data;
          if (typeof ret === 'string') {
            const reg = /^\w+\(({.+})\)$/;
            const matches = ret.match(reg);
            if (matches) {
              ret = JSON.parse(matches[1]);
            }
          }
          res.json(ret);
        }).catch((e) => {
          console.log(e);
        });
      });

      // 获取榜单内的歌曲列表
      app.get('/api/getRankDetail', function(req, res) {
        const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          let ret = response.data;
          if (typeof ret === 'string') {
            const reg = /^\w+\(({.+})\)$/;
            const matches = ret.match(reg);
            if (matches) {
              ret = JSON.parse(matches[1]);
            }
          }
          res.json(ret);
        }).catch((e) => {
          console.log(e);
        });
      });

      // 获取搜索热词
      app.get('/api/getHotWord', function(req, res) {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          let ret = response.data;
          if (typeof ret === 'string') {
            const reg = /^\w+\(({.+})\)$/;
            const matches = ret.match(reg);
            if (matches) {
              ret = JSON.parse(matches[1]);
            }
          }
          res.json(ret);
        }).catch((e) => {
          console.log(e);
        });
      });
    },
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') }
      ]
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.dev.assetsSubDirectory,
      ignore: ['.*']
    }])
  ]
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      devWebpackConfig.devServer.port = port;

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`]
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }));

      resolve(devWebpackConfig);
    }
  });
});
