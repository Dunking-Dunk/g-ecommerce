import path from 'path'
import config from './webpack.config.js'
import { fileURLToPath } from 'url'
import { merge } from 'webpack-merge'
import { internalIpV4Sync } from 'internal-ip'
import portFinderSync from 'portfinder-sync'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const infoColor = (_message) => {
    return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`
}

export default merge(config, {
    mode: 'development',

    devtool: 'inline-source-map',

    devServer: {
        devMiddleware: {
            writeToDisk: true,
        },
    },

    output: {
        path: path.resolve(__dirname, 'public'),
    },
})
