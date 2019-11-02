const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = (keys = []) => {

    const config = {
        mode: 'production',
        entry: path.resolve(__dirname, '../../app/server/server_game/app.js'),
        output: {
            path: path.resolve(__dirname, '../../dist/server/server_game'),
            filename: 'app.js'
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                        chunks: 'initial',
                        name: true,
                        enforce: true
                    },
                }
            }
        },
        plugins: [
            new CleanWebpackPlugin.CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../../app/server/server_game/index.html'),
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                },
            }),
        ],
        module: {
            rules: [],
        }
    }

    const develblock = {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /(node_modules|bower_components|\.spec\.js)/,
        use: []
    }

    for (const key of keys) {
        develblock.use.push({
            loader: 'webpack-strip-block',
            options: {
                start: `develblock:${key}`,
                end: 'develblock:end'
            }
        })
    }

    config.module.rules.push(develblock)
    return config
}