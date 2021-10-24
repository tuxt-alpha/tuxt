{{#each mixins}}
import {{moduleName}} from '{{module}}'
{{/each}}

export default {
  {{#each mixins}}
  '{{name}}': {{moduleName}},
  {{/each}}
}