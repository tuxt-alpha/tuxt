import { resolve } from 'path'
import { isPlainObject } from '../../utils/index'

const assign = Object.assign

export default class TuxtConfig {
  constructor(options = {}) {
    this.options = options
  }

  get distPath() {
    return resolve(this.options.distDir || 'dist')
  }

  get srcPath() {
    return resolve(this.options.srcDir || '.')
  }

  dir() {
    const userDir = this.options.dir
    const defaultDir = {
      assets: 'assets',
      components: 'components',
      layouts: 'layouts',
      middleware: 'middleware',
      mixins: 'mixins',
      pages: 'pages',
      plugins: 'plugins',
      static: 'static',
      store: 'store',
    }
    return isPlainObject(userDir) ? assign(defaultDir, userDir) : defaultDir
  }

  get proxy() {
    return this.options.proxy || {}
  }

  get webpack() {
    return this.options.webpack || {}
  }

  get plugins() {
    return this.options.plugins || []
  }

  get css() {
    return this.options.css || []
  }

  get router() {
    return this.options.router || {}
  }

  get babel() {
    return this.options.babel || {}
  }

  get postcss() {
    const userPostcss = this.options.postcss
    return userPostcss !== undefined ? userPostcss : true
  }

  get head() {
    return this.options.head || {}
  }

  get analyzer() {
    const userAnalyzer = this.options.analyzer
    return typeof userAnalyzer === 'boolean' ? userAnalyzer : !!userAnalyzer
  }

  normalizeAarray(arr = []) {
    if (typeof arr === 'string') arr = [arr]
    return arr
  }

  config() {
    return {
      buildPath: resolve('.tuxt'),
      distPath: this.distPath,
      srcPath: this.srcPath,
      dir: this.dir(),
      proxy: this.proxy,
      webpack: this.webpack,
      plugins: this.plugins,
      css: this.css,
      router: {
        middleware: this.normalizeAarray(this.router.middleware),
        useMixins: this.normalizeAarray(this.router.useMixins),
      },
      babel: this.babel,
      postcss: this.postcss,
      head: this.head,
      analyzer: this.analyzer,
    }
  }
}