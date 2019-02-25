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