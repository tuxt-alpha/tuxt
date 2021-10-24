// import path from 'path'
import Hookable from 'hable'
import consola from 'consola'

import TuxtConfig from '../../config/index'
import Resolver from '../../resolver/index'
import Compiler from '../../compiler/index'
import WebpackConfig from '../../webpack/index'

export default class Tuxt extends Hookable {
  constructor(options) {
    super(consola)

    this.env = process.env.NODE_ENV

    this.options  = new TuxtConfig(options).config()
    this.resolver = new Resolver(this)
    this.compiler = new Compiler(this)

  }

  async ready() {
    await this.resolver.ready()
    await this.compiler.ready()

    this.webpackConfig = new WebpackConfig(this).config()
    
    return this
  }
}