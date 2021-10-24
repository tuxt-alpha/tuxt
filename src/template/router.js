import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

{{#each routes}}
const {{componentName}} = () => import(/* webpackChunkName: "{{chunkName}}" */ '{{component}}')
{{/each}}

export default new VueRouter({
  mode: 'history',
  routes: [
    {{#each routes}}
    {
      path: '{{path}}',
      name: '{{name}}',
      component: {{componentName}},
    },
    {{/each}}
  ]
})