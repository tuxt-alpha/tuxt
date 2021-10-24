// import path from 'path'
import webpack from 'webpack'
// import consola from 'consola'
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import WebpackBase from './base'
import FriendlyEndingPlugin from './plugins/friendly-ending-plugin'

export default class WebpackDev extends WebpackBase {
  constructor(tuxt) {
    super(tuxt)
  }

  devServer() {
    return {
      clientLogLevel: 'error',
      compress: true,
      contentBase: this.resolve(this.options.dir.static),
      historyApiFallback: true,
      hot: true,
      host: '0.0.0.0',
      port: 8080,
      index: 'index.html',
      proxy: this.options.proxy,
      publicPath: '/',
      quiet: true,
      overlay: {
        warnings: false,
        errors: true,
      },
      stats: 'errors-only',
      watchOptions: {
        aggregateTimeout: 1000,
        poll: false,
      },
    }
  }

  plugins() {
    const plugins = super.plugins()

    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new FriendlyErrorsWebpackPlugin(),
      new FriendlyEndingPlugin(),
    )

    return plugins
  }

  cssLoaders() {
    const loaders = super.cssLoaders()

    loaders.unshift({
      loader: 'style-loader',
    })

    return loaders
  }

  config() {
    const config = super.config.call(this)

    config.devServer = this.devServer()
    // "^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$"
    config.devtool = 'eval-cheap-module-source-map'

    return config
  }
}