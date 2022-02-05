const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
import HscryptPlugin from 'hscrypt-webpack-plugin'
import webpack from "webpack"

const hscryptPlugin = new HscryptPlugin({
    filename: 'demo.bundle.js',
    pswd: 'my-password',
    path: 'dist',
    // debug: true,
    // iterations: 5000,
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
        hscryptPlugin
    ],
    output: {
        filename: 'demo.bundle.js',
        path: path.resolve(__dirname, 'dist'),
    }
};

export default config;
