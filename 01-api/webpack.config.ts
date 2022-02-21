const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
import HscryptPlugin from 'hscrypt-webpack-plugin'
import webpack from "webpack"

const hscryptPlugin = new HscryptPlugin({
    filename: 'demo.bundle.js',
    pswd: 'my-password',
    path: 'dist',
    // injectHscryptMjs: false,
    //hscryptSrc: 'node_modules/hscrypt/dist/src/hscrypt.mjs',  // local development mode
    debug: true,
    cacheDecryptionKey: true,
    // iterations: 10000,
    // TODO: examples of other config fields
})

const config: webpack.Configuration = {
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
            inject: true,
            template: 'index.html',
        }),
        hscryptPlugin,
    ],
    output: {
        filename: 'demo.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'MyApp',
    }
};

export default config;
