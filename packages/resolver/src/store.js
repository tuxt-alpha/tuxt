import CommonResolver from './common'

export default class StoreResolver extends CommonResolver {
  constructor(resolver) {
    super(resolver)
  }

  async resolve() {
    const modules = await super.resolve({
      dir: this.options.dir.store
    })

    const index = modules.findIndex((item) => item.name === 'index')
    const store = modules[index]

    store && modules.splice(index, 1)

    await this.tuxt.callHook('store:ready', {
      store,
      modules,
      exist: !!(store || modules.length),
    })
  }
}