const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
import HscryptPlugin from 'hscrypt-webpack-plugin'
// const HscryptPlugin = require('hscrypt-webpack-plugin').default;
import webpack from "webpack"

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
            inject: false,
            template: 'index.html',
        }),
        new HscryptPlugin({
            filename: 'demo.bundle.js',
            pswd: 'my-password',
            path: 'dist',
            hscrypt: '../../js/build/src/hscrypt.js',
            // debug: true,
        }),
    ],
    output: {
        filename: 'demo.bundle.js',
        path: path.resolve(__dirname, 'dist'),
    }
};

export default config;
