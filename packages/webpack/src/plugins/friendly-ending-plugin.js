import consola from 'consola'

export default class FriendlyEndingPlugin {
  constructor() {
    this.name = 'FriendlyEndingPlugin'
    this.firstCompilation = false
  }
  apply(compiler) {
    const _doneFn = (stats) => {
      if (this.firstCompilation) return
      const { host, port } = compiler.options.devServer
      consola.info(`Listening on: http://${host}:${port}/`)
      this.firstCompilation = true
    }

    if (compiler.hooks) {
      compiler.hooks.done.tap(this.name, _doneFn)
    } else {
      compiler.plugin('done', _doneFn)
    }
  }
}