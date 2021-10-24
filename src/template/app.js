// app.js
import Vue from 'vue'

export default function createApp(router, store) {
  return new Vue({
    
    router: router,

    store: store,

    data() {
      return {
        layout: null,
        statusCode: undefined,
        errorMessage: '',
      }
    },

    computed: {
      error() {
        return this.statusCode === 404 || this.statusCode === 500
      }
    },
  
    render(h) {
      const layout = this.layout
      
      const LayoutView = layout ? (this.error ? h(layout, {
        props: {
          statusCode: this.statusCode,
          errorMessage: this.errorMessage,
        }
      }) : h(layout)) : null

      const domProps = {
        id: 'tuxt',
      }

      return h('div', { domProps }, [ LayoutView ])

    },
  
    methods: {
      setLayout(layout, { statusCode = 200, errorMessage = '' } = {}) {
        this.layout = layout
        this.statusCode = statusCode
        this.errorMessage = errorMessage
      },
    },
  
    middleware: [
      {{#each globalData.middleware}}
      '{{this}}',
      {{/each}}
    ],

    useMixins: [
      {{#each globalData.useMixins}}
      '{{this}}',
      {{/each}}
    ],
  
  })
}