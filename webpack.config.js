import path from 'path'
import webpack from 'webpack'
import { fileURLToPath } from 'url'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'

const _dirname = path.dirname(fileURLToPath(import.meta.url))
const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'

const dirApp = path.join(_dirname, 'app')
const dirStyles = path.join(_dirname, 'styles')
const dirShared = path.join(_dirname, 'shared')
const dirNode = 'node_modules'

export default {
    entry: [path.join(dirApp, 'index.js'), path.join(dirStyles, 'index.scss')],

    resolve: {
        modules: [dirApp, dirStyles, dirNode, dirShared],
    },

    plugins: [
        new webpack.DefinePlugin({
            IS_DEVELOPMENT,
        }),

        new CleanWebpackPlugin(),
        // new HtmlWebpackPlugin(),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './shared',
                    to: '',
                },
            ],
        }),

        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new ImageMinimizerPlugin({
            minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                    // Lossless optimization with custom option
                    // Feel free to experiment with options for better result for you
                    plugins: [
                        ['gifsicle', { interlaced: true }],
                        ['jpegtran', { progressive: true }],
                        ['optipng', { optimizationLevel: 5 }],
                    ],
                },
            },
        }),

        new ESLintPlugin(),

        new TerserWebpackPlugin(),
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '',
                        },
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                    },
                    {
                        loader: 'sass-loader',
                    },
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg|webp|woff2|fnt)$/,
                loader: 'file-loader',
                options: {
                    name(file) {
                        return '[hash].[ext]'
                    },
                },
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: ImageMinimizerPlugin.loader,
                    },
                ],
            },

            {
                test: /\.(glsl|frag|vert)$/i,
                loader: 'raw-loader',
                exclude: /node_modules/,
            },

            {
                test: /\.(glsl|frag|vert)$/i,
                loader: 'glslify-loader',
                exclude: /node_modules/,
            },
        ],
    },

    optimization: {
        minimize: true,
        minimizer: [new TerserWebpackPlugin()],
    },
}
