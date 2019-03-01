# learn_webpack
学习webpack4
## 初始化工程
1. 初始化工程目录
`yarn init -y`
2. 安装webpack及webpack-cli到开发分支
`yarn add webpack webpack -cli`
## 起步使用webpack
1. 新建src/index.js,并安装和使用lodash库
* 安装
`yarn add lodash --save`
* 新建src/index.js
```
import _ from 'lodash'
let arr = ['hello','webpack']
let str = _.join(arr,'')
console.log(str)
```
* 新建全局下webpack.config.js
```
const path = require('path');

module.exports = {
    entry: './src/index.js',  //入口文件
    output: {  //出口
        filename: 'bundle.js',  //打包后文件名
        path: path.resolve(__dirname, 'dist') //出口文件地址
    }
};
```
* npm(package.json)中增加scripts字段
```
"scripts": {
    "build":"webpack"
}
```
* 执行命令
`yarn build`
## 管理资源
    在webpack中，默认只能处理js文件，但是对于css文件，图片，ts文件等其它资源只能通过相应的loader进行
1. 安装css-loader与style-loader
`yarn add css-loader style-loader --save`
2. 编写src/style.css
```
*{
    margin: 0;
    padding: 0;
}
a{
    text-decoration: none;
}
ul,li{
    list-style: none;
}
```
3. src/index.js引入style.css
```
import _ from 'lodash'
import './style.css'
let arr = ['hello','webpack']
let str = _.join(arr,'')
let btn = document.createElement('button')
btn.className = 'add'
console.log(btn)
console.log(str)
```
4. 为webpack.config.js配置loader
```
const path = require('path');

module.exports = {
    entry: './src/index.js',  //入口文件
    output: {  //出口
        filename: 'bundle.js',  //打包后文件名
        path: path.resolve(__dirname, 'dist') //出口文件地址
    },
    module: {
        rules: [ //规则
            {
                test: /\.css$/, //匹配到的文件
                use: [          //使用的loader
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};
```
5. 编译
**这里好像并无法看出css文件被编译，但是当你新建index.html文件的时候，可以明确看到效果**
`yarn build`
## 管理输出

* 需求:
    当我需要同时编译2个以上的文件时，并且这些文件具有依赖关系

    这个时候需要使用index.html文件，因为nodeJs遵循的是requireJs规范，所以无法通过CommonJs规范引入js文件

    但我想每次编译时清理上次编译到dist目录下的文件
1. 安装clean-webpack-plugin插件与html-webpack-template插件
    html-webpack-template插件可以生成一个html页面，并将所以的依赖通过src引入里面
    clean-webpack-plugin插件可以清理dist下的文件
    `yarn add clean-webpack-plugin html-webpack-template`
2. 编写src/print.js文件
```
export default function printMe() {
    console.log('输出print文件')
}
```
3. src/index.js引入print.js文件
```
import _ from 'lodash'
import './style.css'
import print from './print.js'
let arr = ['hello','webpack']
let str = _.join(arr,'')
let btn = document.createElement('button')
print()
btn.className = 'add'
console.log(btn)
console.log(str)
```
4. webpack.config.js重新定义入口与出口文件,并使用以上插件
```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
    entry: { //这里使用对象形式导入
        app:'./src/index.js',
        print:'./src/print.js'
    },
    output: {  //出口
        filename: '[name].bundle.js',  //打包后文件名动态生成
        path: path.resolve(__dirname, 'dist') //出口文件地址
    },
    plugins:[  //这里通过new 构造函数引入插件
        new CleanWebpackPlugin(['dist']),//清理dist目录下的文件
        new HtmlWebpackPlugin({
            title: 'webpack'  //title指html页面的title
        })
    ],
    module: {
        rules: [ //规则
            {
                test: /\.css$/, //匹配到的文件
                use: [          //使用的loader
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};
```
5. 执行打包
`yarn build`
## 开发时需要做的事
* 需求
    在开发时，我们需要每次编写文件保存的时候都自动打包
    在开发时，我们需要一个服务来运行我们的代码
    在开发时，我们需要一个Soucemap(应为名称为地图，这里可以理解为dist下的目录映射src下的目录)来知道我们开发中的代码哪一会有问题
1. webpack.config.js中使用souceMap
```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
    entry: { //这里使用对象形式导入
        app:'./src/index.js',
        print:'./src/print.js'
    },
    devtool: 'inline-source-map',//可以对应到每一行的开发中的代码
    output: {  //出口
        filename: '[name].bundle.js',  //打包后文件名动态生成
        path: path.resolve(__dirname, 'dist') //出口文件地址
    },
    plugins:[  //这里通过new 构造函数引入插件
        new CleanWebpackPlugin(['dist']),//清理dist目录下的文件
        new HtmlWebpackPlugin({
            title: 'webpack'  //title指html页面的title
        })
    ],
    module: {
        rules: [ //规则
            {
                test: /\.css$/, //匹配到的文件
                use: [          //使用的loader
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};
```
2. package.json中使用webpack --watch来自动编译
```
"scripts": {
    "build": "webpack",
    "dev": "webpack --watch"
  },
```
3. 安装webpack-dev-server来开启服务
`yarn add webpack-dev-server --save`
* webpack.config.js中添加服务
```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
    entry: { //这里使用对象形式导入
        app:'./src/index.js',
        print:'./src/print.js'
    },
    devtool: 'inline-source-map',//可以对应到每一行的开发中的代码
    output: {  //出口
        filename: '[name].bundle.js',  //打包后文件名动态生成
        path: path.resolve(__dirname, 'dist') //出口文件地址
    },
    devServer: { //这里以dist目录为服务目录，会自动查找index.html文件,并开启一个端口
        contentBase: './dist'
    },
    plugins:[  //这里通过new 构造函数引入插件
        new CleanWebpackPlugin(['dist']),//清理dist目录下的文件
        new HtmlWebpackPlugin({
            title: 'webpack'  //title指html页面的title
        })
    ],
    module: {
        rules: [ //规则
            {
                test: /\.css$/, //匹配到的文件
                use: [          //使用的loader
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};
```
* package.json中添加start字段
```
"scripts": {
    "build": "webpack",
    "dev": "webpack --watch",
    "start": "webpack-dev-server --open"
  },
```
* 执行start命令
`yarn start`
4. webpack-dev-server是别人已经写好的,现在自己写一个服务
* 这里需要用到express模块(一个node中的包)和一个webpack-dev-middleware一个webpack中服务的中间件在webpack-dev-server内部它使用的就是这个中间件
* 安装express 与webpack-dev-middleware
`yarn add express webpack-dev-middleware --save`
* webpack.config.js中的output定义输出的地址
```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
    entry: { //这里使用对象形式导入
        app:'./src/index.js',
        print:'./src/print.js'
    },
    devtool: 'inline-source-map',//可以对应到每一行的开发中的代码
    output: {  //出口
        filename: '[name].bundle.js',  //打包后文件名动态生成
        path: path.resolve(__dirname, 'dist'), //出口文件地址
        publicPath: '/'
    },
    devServer: { //这里以dist目录为服务目录，会自动查找index.html文件,并开启一个端口
        contentBase: './dist'
    },
    plugins:[  //这里通过new 构造函数引入插件
        new CleanWebpackPlugin(['dist']),//清理dist目录下的文件
        new HtmlWebpackPlugin({
            title: 'webpack'  //title指html页面的title
        })
    ],
    module: {
        rules: [ //规则
            {
                test: /\.css$/, //匹配到的文件
                use: [          //使用的loader
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};
```
* 全局编写server.js
```
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
```
* 在package.json中的scripts增加字段server
```
"scripts": {
    "build": "webpack",
    "dev": "webpack --watch",
    "server": "node server.js",
    "start": "webpack-dev-server --open"
  },
```
* 运行server
`yarn server`
## 模块热替换
    当我们每次修改文件时，我们更加需要直接体现在页面上，而无需重新启动服务
* 修改webpack.config.js，在devServer中增加hot选项为true状态
```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack');
module.exports = {
    entry: { //这里使用对象形式导入
        app:'./src/index.js'
    },
    devtool: 'inline-source-map',//可以对应到每一行的开发中的代码
    output: {  //出口
        filename: '[name].bundle.js',  //打包后文件名动态生成
        path: path.resolve(__dirname, 'dist'), //出口文件地址
        publicPath: '/'
    },
    devServer: { //这里以dist目录为服务目录，会自动查找index.html文件,并开启一个端口
        contentBase: './dist',
        hot: true  //这里hot为true
    },
    plugins:[  //这里通过new 构造函数引入插件
        new CleanWebpackPlugin(['dist']),//清理dist目录下的文件
        new HtmlWebpackPlugin({
            title: 'webpack'  //title指html页面的title
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [ //规则
            {
                test: /\.css$/, //匹配到的文件
                use: [          //使用的loader
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};
```
* 在index.js中通过module.hot监控print.js中的行为
```
import _ from 'lodash'
import './style.css'
import print from './print.js'
let arr = ['hello','webpack']
let str = _.join(arr,'')
let btn = document.createElement('button')
print()
btn.className = 'add'
console.log(btn)
console.log(str)
//如果module.hot存在，且为真
if(module.hot) {
    module.hot.accept('./print.js',function () {
        console.log('print.js中文件发生变化')
    })
}
```
* 跑起服务，修改print.js中的内容观察变化
`yarn start`
```
export default function printMe() {
    console.log('输出print文件')
    console.log('发生变化')
}
```
## tree shaking
    这里指没有用到的代码直接移除
* package.json中添加sideEffects
```
{
  "name": "webpack-docs",
  "version": "0.0.1",
  "description": "学习webpack",
  "sideEffects": false,
  "main": "dist/index.js",
  "scripts": {
    "build": "webpack",
    "dev": "webpack --watch",
    "server": "node server.js",
    "start": "webpack-dev-server --open"
  },
  "repository": "https://github.com/wuhaohao1234/learn_webpack.git",
  "author": "wuhaohao <1611499758@qq.com>",
  "license": "MIT",
  "dependencies": {
    "clean-webpack-plugin": "^1.0.1",
    "css-loader": "^2.1.0",
    "express": "^4.16.4",
    "html-webpack-plugin": "^3.2.0",
    "lodash": "^4.17.11",
    "style-loader": "^0.23.1",
    "webpack": "^4.29.6",
    "webpack-cli": "^3.2.3",
    "webpack-dev-middleware": "^3.6.0",
    "webpack-dev-server": "^3.2.1"
  }
}
```
* webpack.config.json中添加mode，为生产环境下的
    生产环境中代码必须全局压缩为不可见性
```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack');
module.exports = {
    entry: { //这里使用对象形式导入
        app:'./src/index.js'
    },
    devtool: 'inline-source-map',//可以对应到每一行的开发中的代码
    output: {  //出口
        filename: '[name].bundle.js',  //打包后文件名动态生成
        path: path.resolve(__dirname, 'dist'), //出口文件地址
        publicPath: '/'
    },
    module:'production',//这里为生产环境
    devServer: { //这里以dist目录为服务目录，会自动查找index.html文件,并开启一个端口
        contentBase: './dist',
        hot: true  //这里hot为true
    },
    plugins:[  //这里通过new 构造函数引入插件
        new CleanWebpackPlugin(['dist']),//清理dist目录下的文件
        new HtmlWebpackPlugin({
            title: 'webpack'  //title指html页面的title
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [ //规则
            {
                test: /\.css$/, //匹配到的文件
                use: [          //使用的loader
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};
```
## 生产环境构建
    在生产环节中，我们更加希望可以拆分webpake.config.js，这个时候需要webpack-merge
* 安装
`yarn add webpack-merge --save`
* 拆分webpack.config.js为webpack.common.js,webpack.dev.js,webpack.prod.js
* webpack.common.js
```
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Production'
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
```
* webpack.dev.js
```
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    }
});
```
* webpack.prod.js
```
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    plugins: [
        new UglifyJSPlugin()
    ]
});
```
* 修改package.json中的scripts
```
{
  "name": "webpack-docs",
  "version": "0.0.1",
  "description": "学习webpack",
  "sideEffects": false,
  "main": "dist/index.js",
  "scripts": {
    "build": "webpack --config webpack.prod.js",
    "start": "webpack-dev-server --open --config webpack.dev.js"
  },
  "repository": "https://github.com/wuhaohao1234/learn_webpack.git",
  "author": "wuhaohao <1611499758@qq.com>",
  "license": "MIT",
  "dependencies": {
    "clean-webpack-plugin": "^1.0.1",
    "css-loader": "^2.1.0",
    "express": "^4.16.4",
    "html-webpack-plugin": "^3.2.0",
    "lodash": "^4.17.11",
    "style-loader": "^0.23.1",
    "webpack": "^4.29.6",
    "webpack-cli": "^3.2.3",
    "webpack-dev-middleware": "^3.6.0",
    "webpack-dev-server": "^3.2.1",
    "webpack-merge": "^4.2.1"
  }
}
```
* 执行命令相应命令
`yarn start || yarn build`
* 这下我们需要souceMap来提供映射到src文件,并且说明这是生产环节,在webpack.prod.js中
```
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const webpack = require('webpack');
module.exports = merge(common, {
    devtools: 'souce-map',
    plugins: [
        new UglifyJSPlugin({ //这是souceMap为true
            souceMap: true
        }),
        new webpack.DefinePlugin({  //这是生产环节
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
});
```
* index.js中确定这是生产环节
```
import _ from 'lodash'
import print from './print.js'

import { sum } from './math'

let arr = ['hello','webpack']
let str = _.join(arr,'')
let btn = document.createElement('button')
print()
btn.className = 'add'
console.log(btn)
console.log(str)

console.log(sum(5))
if(module.hot) {
    module.hot.accept('./print.js',function () {
        console.log('print.js中文件发生变化')
    })
}

if (process.env.NODE_ENV !== 'production') {
    console.log('这是生产环节')
}
```

## 未完，待续
1. 详细文档
https://www.webpackjs.com/guides/
2. 配置
https://www.webpackjs.com/configuration/