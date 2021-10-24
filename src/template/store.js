import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

{{#if store.store}}
{{#with store.store}}
import * as {{moduleName}} from '{{module}}'
{{/with}}
{{/if}}

{{#each store.modules}}
import * as {{moduleName}} from '{{module}}'
{{/each}}

const store = new Vuex.Store({
  {{#if store.store}}
  {{#with store.store}}
  ...{{moduleName}},
  {{/with}}
  {{/if}}

  modules: {
    {{#each store.modules}}
    '{{name}}': {
      namespaced: true,
      ...{{moduleName}},
    },
    {{/each}}
  }
})

export default store