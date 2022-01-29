const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var HscryptPlugin = require('webpack-plugin').default;
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
        new HtmlWebpackPlugin({
            inject: false,
            template: 'index.html',
        }),
        new HscryptPlugin({
            filename: 'demo.bundle.js',
            path: 'dist',
            hscrypt: '../../js/dist/hscrypt.bundle.js',
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
