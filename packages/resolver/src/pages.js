import path from 'path'
import { relative, createRandomString, classof } from '../../utils/index'
import CommonResolver from './common'

export default class PagesResolver extends CommonResolver {
  constructor(resolver) {
    super(resolver)
  }

  async resolve() {
    const pages = this.normalizePages()
    let routes = []

    for (let i = 0, len = pages.length; i < len; i++) {
      const item = pages[i]
      const result = await super.resolve({
        dir: item.dir,
        fileParser: this.createRoute.bind(this, item.publicPath),
      })

      routes = routes.concat(result)
    }

    await this.tuxt.callHook('routes:ready', routes)
  }

  normalizePages() {
    const userPages = this.options.dir.pages
    return 'Array' === classof(userPages) ? userPages.map(this.normalizeItem) : [this.normalizeItem(userPages)]
  }

  normalizeItem(item) {
    if (typeof item === 'string') {
      item = {
        dir: item
      }
    }

    return {
      dir: item.dir || 'pages',
      publicPath: item.publicPath || '/',
    }

  }

  createRoute(publicPath, dir, file) {
    const names = this.splitPath(dir, file)
    const chunkPath = names.join('/').replace(/\/?index$/, '')
    return {
      path: ('/' + publicPath + '/').replace(/\/{2,}/g, '/') + chunkPath,
      name: names.join('-'),
      component: relative(path.relative)(this.options.buildPath, path.resolve(this.options.srcPath, file)),
      componentName: '_' + createRandomString(),
      chunkName: chunkPath,
    }
  }
}