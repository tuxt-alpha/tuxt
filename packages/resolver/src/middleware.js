import CommonResolver from './common'

export default class MiddlewareResolver extends CommonResolver {
  constructor(resolver) {
    super(resolver)
  }

  async resolve() {
    const middleware = await super.resolve({
      dir: this.options.dir.middleware
    })

    await this.tuxt.callHook('middleware:ready', middleware)
  }
}