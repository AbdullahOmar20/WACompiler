const path = require("path");
module.exports = {
    entry: './built/src/index.js',
    output:{
        filename : 'bundle.js',
        path : path.resolve(__dirname, 'dist')
    }
}