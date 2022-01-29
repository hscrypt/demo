const path = require('path');

var HelloWorldPlugin = require('demo/webpack-plugin');

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
        new HelloWorldPlugin({ options: true, }),
    ],
    output: {
        filename: 'demo.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        // libraryTarget: 'var',
        // library: 'foo',
        clean: true,
    },
    // optimization: {
    //     runtimeChunk: 'single',
    // },
};
