const path = require('path');

module.exports = {
    entry: "./src/index.tsx",
    output: {
        path: path.resolve(__dirname,"dist"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.js|jsx|tsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                        '@babel/preset-env',
                        ['@babel/preset-react',{'runtime':'automatic'}]
                        ]
                    }
                }
            }
        ]
    }
}