import path from 'path'
import config from './webpack.config.js'
import { fileURLToPath } from 'url'
import { merge } from 'webpack-merge'

const _dirname = path.dirname(fileURLToPath(import.meta.url))

export default merge(config, {
    mode: 'production',

    output: {
        path: path.join(_dirname, 'public'),
    },
})
