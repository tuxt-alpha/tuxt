{{#each middleware}}
import {{moduleName}} from '{{module}}'
{{/each}}

export default {
  {{#each middleware}}
  '{{name}}': {{moduleName}},
  {{/each}}
}