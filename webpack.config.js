const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
console.log(HTMLWebpackPlugin)
// import HtmlWebpackPlugin from 'html-webpack-plugin';

var HscryptPlugin = require('hscrypt-webpack-plugin').default;
console.log(HscryptPlugin)

module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.ts', '.js', ],
    },
    plugins: [
        new HTMLWebpackPlugin({
            inject: false,
            template: 'index.html',
        }),
        new HscryptPlugin({
            // HTMLWebpackPlugin,
            filename: 'demo.bundle.js',
            path: 'dist',
            hscrypt: '../../js/dist/hscrypt.bundle.js',
            debug: true,
        }),
    ],
    output: {
        filename: 'demo.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        // libraryTarget: 'var',
        // library: 'foo',
        // clean: true,
    },
    // optimization: {
    //     runtimeChunk: 'single',
    // },
};
