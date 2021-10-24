import fs from 'fs-extra'
import path from 'path'
import glob from 'glob'
import pify from 'pify'
import handlebars from 'handlebars'
import rimraf from 'rimraf'

const glop = pify(glob)
// temp directory
const __temp = path.resolve(__dirname, '..', '.temp')

export default class Compiler {
  constructor(tuxt) {
    this.tuxt = tuxt
    this.options = this.tuxt.options

    this.tuxt.hook('layouts:ready', (data) => this.layouts = data)
    this.tuxt.hook('routes:ready', (data) => this.routes = data)
    this.tuxt.hook('middleware:ready', (data) => this.middleware = data)
    this.tuxt.hook('mixins:ready', (data) => this.mixins = data)
    this.tuxt.hook('store:ready', (data) => this.store = data)
  }

  get templateData() {
    return {
      routes: this.routes,
      layouts: this.layouts,
      middleware: this.middleware,
      mixins: this.mixins,
      store: this.store,
      css: this.options.css,
      plugins: this.options.plugins,
      globalData: {
        middleware: this.options.router.middleware,
        useMixins: this.options.router.useMixins,
      }
    }
  }

  async ready() {
    await this.compile()
    await this.output()
  }

  async compile() {
    const templateData = this.templateData
    const templatePath = path.resolve(__dirname, '..', 'src/template')

    const files = await glop('**/*.{js,vue}', {
      cwd: templatePath
    })

    for (let i = 0, len = files.length; i < len; i++) {
      const file = files[i]
      const content = await fs.readFile(path.resolve(templatePath, file), 'utf8')
      const result = handlebars.compile(content)(templateData)
      await this.output2temp(file, result)
    }

  }

  async output2temp(file, content) {
    await fs.ensureDir(__temp)
    await fs.outputFile(path.resolve(__temp, file), content)
  }

  async output() {
    await fs.copy(__temp, this.options.buildPath)
    await pify(rimraf)(__temp)
  }
}