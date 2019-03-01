const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

//app使用webpackDevMiddleware这个模块,并将config.output.publicPath('/')作为导航
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));

//服务跑在3000端口
app.listen(3000, function () {
    console.log('服务跑在3000端口!\n');
});