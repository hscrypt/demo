const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
console.log(HTMLWebpackPlugin, require.resolve('html-webpack-plugin'))
// import HtmlWebpackPlugin from 'html-webpack-plugin';

// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;

var HscryptPlugin = require('hscrypt-webpack-plugin').default;
console.log(HscryptPlugin, require.resolve('hscrypt-webpack-plugin'))

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
            // {
            //     test: /\.css$/,
            //     use: [
            //         MiniCssExtractPlugin.loader,
            //         "css-loader"
            //     ]
            // }
        ],
    },
    resolve: {
        extensions: [ '.ts', '.js', /*'.css',*/ ],
    },
    plugins: [
        new HTMLWebpackPlugin({
            inject: false,
            template: 'index.html',
        }),
        // new MiniCssExtractPlugin({
        //     filename: "[name].css",
        //     chunkFilename: "[id].css"
        // }),
        // new HTMLInlineCSSWebpackPlugin({ HTMLWebpackPlugin }),
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
