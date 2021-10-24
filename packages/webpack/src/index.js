import merge from 'webpack-merge'
import WebpackDev from './dev'
import WebpackProd from './prod'

export default class WebpackConfig {
  constructor(tuxt) {
    this.tuxt = tuxt
    this.options = this.tuxt.options
    this.webpack = this.prod ? new WebpackProd(this.tuxt) : new WebpackDev(this.tuxt)
  }

  get prod() {
    return this.tuxt.env === 'production'
  }

  config() {
    return merge(this.webpack.config(), this.options.webpack)
  }
}