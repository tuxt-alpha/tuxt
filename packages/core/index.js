import path from 'path'
import Tuxt from '../tuxt/index'
import Builder from '../builder/index'

const config = require(path.resolve(process.cwd(), '.', 'tuxt.config.js'))

new Tuxt(config).ready().then((tuxt) => new Builder(tuxt).build())