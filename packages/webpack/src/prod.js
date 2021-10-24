// import path from 'path'
// import webpack from 'webpack'
// import consola from 'consola'
// import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
// import HtmlWebpackPlugin from 'html-webpack-plugin'
// import WebpackBarPlugin from 'webpackbar'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import WebpackBase from './base'
// import FriendlyEndingPlugin from './plugins/friendly-ending-plugin'

export default class WebpackProd extends WebpackBase {
  constructor(tuxt) {
    super(tuxt)
  }

  cssLoaders() {
    const loaders = super.cssLoaders()

    loaders.unshift({
      loader: MiniCssExtractPlugin.loader,
    })

    return loaders
  }

  plugins() {
    const plugins = super.plugins()

    plugins.push(
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].css',
      }),
      new CopyWebpackPlugin({
        patterns: [{
          from: this.resolve(this.options.dir.static),
          to: '[path][name][ext]',
        }]
      }),
    )

    if (this.options.analyzer) {
      plugins.push(new BundleAnalyzerPlugin())
    }

    return plugins
  }

  config() {
    const config = super.config.call(this)

    config.optimization.minimizer = [
      '...', 
      new CssMinimizerPlugin(),
    ]

    config.devtool = false
    return config
  }
}