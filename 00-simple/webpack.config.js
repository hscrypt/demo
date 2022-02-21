const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin");
const HscryptPlugin = require("hscrypt-webpack-plugin").default;

module.exports = {
    entry: "./src/secret.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js"
    },
    plugins: [
        new HTMLWebpackPlugin({
            inject: true,
            template: 'index.html',
        }),
        new HscryptPlugin({
            path: "dist",
            filename: "bundle.js",
            pswd: "my-password",
            debug: true,
        })
    ]
}
