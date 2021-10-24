// import path from 'path'
import LayoutsResolver from './layouts'
import PagesResolver from './pages'
import MiddlewareResolver from './middleware'
import MixinsResolver from './mixins'
import StoreResolver from './store'

export default class Resolver {
  constructor(tuxt) {
    this.tuxt = tuxt
    this.options = this.tuxt.options
  }

  async ready() {
    await new LayoutsResolver(this).ready()
    await new PagesResolver(this).ready()
    await new MiddlewareResolver(this).ready()
    await new MixinsResolver(this).ready()
    await new StoreResolver(this).ready()
  }
}