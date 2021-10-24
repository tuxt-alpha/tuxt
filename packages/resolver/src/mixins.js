import CommonResolver from './common'

export default class MixinsResolver extends CommonResolver {
  constructor(resolver) {
    super(resolver)
  }

  async resolve() {
    const mixins = await super.resolve({
      dir: this.options.dir.mixins
    })

    await this.tuxt.callHook('mixins:ready', mixins)
  }
}