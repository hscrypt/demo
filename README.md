# hscrypt demo
Simple example using [`hscrypt`] and [`hscrypt-webpack-plugin`] to encrypt and deploy a static site

Conceptually, it's as simple as:

```html
<!-- index.html -->
<html>
<body>
This page is encrypted! Provide password as URL hash.
</body>
</html>
```

```javascript
// secret.js
document.body.innerHTML = 'secret message 🐿'
```

```javascript
// webpack.config.js
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
import HscryptPlugin from 'hscrypt-webpack-plugin'

const config = {
    entry: 'secret.ts',
    plugins: [
        new HTMLWebpackPlugin({
            inject: true,
            template: 'index.html',
        }),
        new HscryptPlugin({
            filename: 'secret.bundle.js',
            pswd: 'my-password',
            path: 'dist',
        }),
    ],
    output: {
        filename: 'secret.bundle.js',
        path: path.resolve(__dirname, 'dist'),
    }
};
export default config;
```


```bash
npm install webpack
node_modules/.bin/webpack

```
[`hscrypt`]: https://github.com/hscrypt/js
[`hscrypt-webpack-plugin`]: https://github.com/hscrypt/webpack-plugin
