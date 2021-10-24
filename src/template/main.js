import Vue from 'vue'

{{#each css}}
import '{{this}}'
{{/each}}

import createApp from './app'
import router from './router'
import store from './store'
import LayoutData from './layouts'
import MiddlewareData from './middleware'
import MixinData from './mixins'

{{#each plugins}}
import '{{this}}'
{{/each}}

Vue.config.productionTip = false

const app = createApp(router, store).$mount('#app')
const resolved = router.resolve(location.pathname)
// init
initApp(resolved.route)
// beforeEach
router.beforeEach(beforeAsyncComponentResolve)
// beforeResolve
router.beforeResolve(afterAsyncComponentResolve)

function initApp(route) {
  beforeAsyncComponentResolve(route)
}

// What to do before async component resolved
function beforeAsyncComponentResolve(to, from, next) {
  // Run global middleware
  runMiddleware({
    middleware: app.middleware,
    route: to,
  })

  // Page not found
  if (to.matched.length === 0) {
    renderError(404);
    return
  }

  next && next()
}

// After resolved ...
function afterAsyncComponentResolve(to, from, next) {
  const component = to.matched[0].components.default
  const layout = existLayout(component.layout)

  // Layout not found
  if (!layout) {
    renderError(500, 'Layout does not exist');
    return
  }

  // Run layout and component middleware
  runMiddleware({
    middleware: [...normalizeAarray(layout.middleware), ...normalizeAarray(component.middleware)],
    route: to,
  })

  // Inject mixins
  addMixinsToComponent(app, layout, component)

  if (app.layout && app.layout.name === layout.name) {
    next && next();
    return
  }

  app.setLayout(layout), next && next()
}

function existLayout(name = 'default') {
  const _layout = (name) => {
    const layout = LayoutData[name]
    layout.name = name
    return layout
  }
  return LayoutData.hasOwnProperty(name) ? _layout(name) : false
}

function renderError(statusCode, errorMessage) {
  const error = LayoutData['error']
  app.setLayout(error, {
    statusCode,
    errorMessage: errorMessage || statusCode === 404 ? 'Not found' : 'Page error',
  })
}

// ensure return a array
function normalizeAarray(arr = []) {
  if (typeof arr === 'string') {
    arr = [arr]
  }
  return arr
}

function addMixinsToComponent(app, layout, component) {
  const mixins = component.mixins || []
  const mixinPool = [
    ...normalizeAarray(app.useMixins),
    ...normalizeAarray(layout.useMixins),
    ...normalizeAarray(component.useMixins),
  ]

  mixinPool.forEach((name) => {
    MixinData.hasOwnProperty(name) && mixins.push(MixinData[name])
  })

  component.mixins = mixins
}

function runMiddleware({ middleware, route }) {
  normalizeAarray(middleware).forEach((name) => {
    const fn = MiddlewareData[name]
    fn && fn({
      route,
      redirect: router.replace,
    })
  })
}