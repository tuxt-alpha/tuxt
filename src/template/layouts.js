{{#each layouts}}
import {{moduleName}} from '{{module}}'
{{/each}}

export default {
  {{#each layouts}}
  '{{name}}': {{moduleName}},
  {{/each}}
}