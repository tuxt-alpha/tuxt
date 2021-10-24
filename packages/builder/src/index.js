import pify from 'pify'
import rimraf from 'rimraf'
import consola from 'consola'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

export default class Builder {
  constructor(tuxt) {
    this.tuxt = tuxt
    this.options = this.tuxt.options
  }

  get config() {
    return this.tuxt.webpackConfig || {}
  }

  get env() {
    return this.tuxt.env
  }

  async build() {
    this.env === 'production' ? this.prod() : this.dev()
  }

  dev() {
    const config = this.config
    const compiler = webpack(config)
    const devServer = config.devServer
    const server = new WebpackDevServer(compiler, devServer)
    const { host, port } = devServer
    server.listen(port, host, (err) => {
      if (err) throw err;
      consola.info(`Serve is listening on: http://${host}:${port}/`)
    })
  }

  prod() {
    rimraf(this.options.distPath, () => webpack(this.config, (err, stats) => {
      if (err) {
        consola.error(err.stack || err)
        if (err.details) {
          consola.error(err.details)
        }
        return err
      }

      stats.toJson({
        assetsSort: 'field',
      }).assets.forEach(asset => {
        consola.info(`Generated ${asset.type}: ${asset.name}`)
      })

      console.log()
      consola.success('Tuxt build successfully.')
      console.log()
    }))
  }
}