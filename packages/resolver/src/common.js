import path from 'path'
import glob from 'glob'
import pify from 'pify'
import { relative, camelify, createRandomString } from '../../utils/index'

const glop = pify(glob)

export default class CommonResolver {
  constructor(resolver) {
    this.tuxt = resolver.tuxt
    this.options = this.tuxt.options
  }

  async ready() {
    await this.resolve()
  }

  async resolve({
    dir,
    findExtensions = ['js', 'vue'],
    fileParser = this.fileParser,
  }) {
    const files = await glop(`${dir}/**/*.{${findExtensions.join(',')}}`, {
      cwd: this.options.srcPath,
    })

    return files.map((file) => fileParser.call(this, dir, file))
  }

  fileParser(dir, file) {
    const names = this.splitPath(dir, file)
    return {
      name: names.join('-'),
      module: relative(path.relative)(this.options.buildPath, path.resolve(this.options.srcPath, file)),
      moduleName: '_' + createRandomString(),
    }
  }

  splitPath(dir, file) {
    return file
      .replace(new RegExp('^' + dir), '')
      .replace(/\.\w+$/, '')
      .replace(/[\\\/]+/g, '/')
      .split('/')
      .slice(1)
      .map(camelify)
  }
}