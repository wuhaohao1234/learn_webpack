# learn_webpack
学习webpack4
## 入门

1. 初始化项目

`yarn init -y`

2. 添加开发环境依赖

`yarn add webpack webpack-cli  --save`

3. 创建项目目录
```
dist
    index.html
src
    index.js
```
4. 编写代码

    1. package.json中确保我们安装包是私有的(private)，并且移除 main 入口

    ```
    {
        "name": "learn_webpack",
        "version": "0.0.1",
        "private": true,//确定模块为私有模块
        "repository": "https://github.com/wuhaohao1234/learn_webpack.git",
        "author": "wuhaohao <1611499758@qq.com>",
        "license": "MIT",
        "dependencies": {
            "lodash": "^4.17.11",
            "webpack": "^4.29.5",
            "webpack-cli": "^3.2.3"
        }
    }

    ```
    2. src/index.js

    首先安装lodash为生产环境
    `yarn add lodash --save`
    #src/index.js
    ```
    import _ from 'lodash'
    function component() {
        var element = document.createElement('div')
        element.innerHTML = _.join(['Hello', 'webpack'], ' ');
        return element
    }
    document.body.appendChild(component())
    ```
    3. 执行构建 ./node_modules/.bin/webpack
    `yarn webpack`
    4. 新建webpack.config.js
    ```
    const path = require('path')

    module.exports = {
        entry: './src/index.js',//入口文件
        output: {
            filename: 'bundle.js',//新的文件名
            path: path.resolve(__dirname,'dist')//编译到指定目录
        }
    }
    ```
    5. package.json中增加scripts字段
    ```
    "scripts": {
        "build": "webpack"    
    },
    ```
    如果全局下webpack.config.js存在,webpack会找全局下的webpack.config.js进行编译
    6. 执行编译
    `yarn build`

## 管理资源

1. 加载css资源
    * 开发环境安装style-loader css-loader
    `yarn add style-loader css-loader`
    * 添加webpack.config.js中的模块规则
    ```
    const path = require('path')

    module.exports = {
        entry: './src/index.js',
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname,'dist')
        },
        module: {  //模块
            rules: [
                {   //规则
                    test: /\.css$/, //这里写一个正则表达式,匹配所有的.css文件
                    use: [
                        'style-loader', //使用style-loader
                        'css-loader' //使用css-loader
                    ]
                }
            ]
        }
    }
    ```
    * 新增src/style.css
    ```
    .hello{
        color:red;
    }
    ```
    * 改变index.js中的className(这里省略)
    * 执行命令
    `yarn build`
## 管理输出

1. 新增插件html-webpack-plugin用来生成dist/index.html文件
`yarn add html-webpack-plugin --save`
2. 新增clean-webpack-plugin用来清理上一次的dist目录下的文件
`yarn add clean-webpack-plugin --save`
3. 新增src/print.js文件
```
export default function printMe() {
    console.log('I get called from print.js!');
}
```
4. 调整webpack
```
const path = require('path')
//生成src/index.html文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 清理dist下目录的文件
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    entry: { //入口文件
        app: './src/index.js',  
        print: './src/print.js'
    },
    output: {//出口文件采用动态匹配形式
        filename: '[name].bundel.js',
        path: path.resolve(__dirname,'dist')
    },
    plugins: [ //先清理dist下的所有文件,然后它会自动生成一个index.html文件并给定title
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: '我是webpack'
        })
    ],
    module: {  //模块
        rules: [  //模块匹配规则,数组形式
            {     //匹配所有css文件,用到css-loader与style-loader
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },     //匹配图片，用到file-loader
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    }
}
```
5. 执行命令
`yarn build`

## 开发中的

    在webpack打包源代码中，由于代码经过压缩，所以无法定位到到底哪里出错

1. 使用source map

改变webpack.config.js,增加devtool选项
```
const path = require('path')
//生成src/index.html文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 清理dist下目录的文件
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    entry: {
        app: './src/index.js',
        print: './src/print.js'
    },
    output: {
        filename: '[name].bundel.js',
        path: path.resolve(__dirname,'dist')
    },
    devtool: 'inline-source-map',  //这里是按照每一行的错误进行匹配
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: '我是webpack'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    }
}
```
2. print.js中故意搞出个错误
```
export default function printMe() {
    console.error('错误')
    console.log('I get called from print.js!');
}
```
3. 执行
`yarn build`
这下在浏览器中就可以看到是src/print.js中的第二行出错
4. 每次修改文件都经行编译到dist文件夹下，不需要再自己编译
修改package.json中的scripts字段，增加watch
```
"scripts": {
    "build": "webpack",
    "watch": "webpack --watch"
  },
```
5. 执行watch字段
`yarn watch`
6. 无需刷新浏览器即可看到修改后的效果
    * 下载webpack-dev-server
    `yarn add webpack-dev-server --save`
    * 在webpack.config.js中添加字段告诉应该在哪一个地址下开启项目
    ```
    devServer:{
        contentBase: './dist'
    }
    ```
    * 添加scripts字段start
    `start: "webpack-dev-server --open"`
    * 启动命令
    `yarn start`
    * 安装express webapck-dev-middleware
    `yarn add express webapck-dev-middleware --save`
    * 在webpack.config.js中的output添加publickName字段
    ```
        const path = require('path')
        //生成src/index.html文件
        const HtmlWebpackPlugin = require('html-webpack-plugin');
        // 清理dist下目录的文件
        const CleanWebpackPlugin = require('clean-webpack-plugin');
        module.exports = {
            entry: {
                app: './src/index.js',
                print: './src/print.js'
            },
            output: {
                filename: '[name].bundel.js',
                path: path.resolve(__dirname,'dist'),
                publicName: '/'
            },
            devtool: 'inline-source-map',
            devServer:{
                contentBase: './dist'
            },
            plugins: [
                new CleanWebpackPlugin(['dist']),
                new HtmlWebpackPlugin({
                    title: '我是webpack'
                })
            ],
            module: {
                rules: [
                    {
                        test: /\.css$/,
                        use: [
                            'style-loader',
                            'css-loader'
                        ]
                    },
                    {
                        test: /\.(png|svg|jpg|gif)$/,
                        use: [
                            'file-loader'
                        ]
                    }
                ]
            }
        }
    ```
    * 新建server.js用来后台展示服务
    ```
    const express = require('express');
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');

    const app = express();
    const config = require('./webpack.config.js');
    const compiler = webpack(config);

    // Tell express to use the webpack-dev-middleware and use the webpack.config.js
    // configuration file as a base.
    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath
    }));

    // Serve the files on port 3000.
    app.listen(3000, function () {
        console.log('Example app listening on port 3000!\n');
    });
    ```
    * 添加package.json中的scripts字段为server
    `server: "node server.js"`
    * 开启服务
    `yarn server`
    * 浏览器打开localhost:3000端口查看
## 模块热替换
    允许在运行时更新各种模块，而无需进行完全刷新
### 启用HMR
* 在webpack.config.js中进行修改
```
const path = require('path')
//生成src/index.html文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 清理dist下目录的文件
const CleanWebpackPlugin = require('clean-webpack-plugin');

const webpack = require('webpack')

module.exports = {
    entry: {
        app: './src/index.js'   
    },
    output: {
        filename: '[name].bundel.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: '我是webpack'
        }),
        new webpack.NamedChunksPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    }
}
```
    * 引入webpack包
    * 在入口文件中删除对于print.js的引入
    * devServer中hot为true
    * plugins增加new webpack.NamedModulesPlugin()再增加new webpack.HotModuleReplacementPlugin()
* 在src/index.js中增加module.hot文件判断
```
import _ from 'lodash'
import './style.css';
import google from './google.svg'

import printMe from './print.js'
function component() {
    var element = document.createElement('div')
    var btn = document.createElement('button')

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello')

    btn.innerHTML = '点击我'
    btn.onclick = printMe

    
    var myImg = new Image()
    myImg.src = google
    element.appendChild(myImg)
    element.appendChild(btn)
    return element
}
document.body.appendChild(component())

if(module.hot) {
    module.hot.accept('./print.js',function () {
        console.log('print中的文件发生变化')
        printMe()
    })
}
```
* 启动webpack-dev-server服务
`yarn start`
* 修改print.js中的文件
```
export default function printMe() {
    console.log('我被改变了,引起更新')
    console.log('I get called from print.js!');
}
```
* 观察chrome中的console
```
print中的文件发生变化
我被改变了,引起更新
I get called from print.js!
``` 