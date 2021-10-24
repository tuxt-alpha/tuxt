import CommonResolver from './common'

export default class LayoutsResolver extends CommonResolver {
  constructor(resolver) {
    super(resolver)
  }

  async resolve() {
    const layouts = await super.resolve({
      dir: this.options.dir.layouts
    })

    await this.tuxt.callHook('layouts:ready', layouts)
  }
}