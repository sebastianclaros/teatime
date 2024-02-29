{{#each properties}}
    {{#if (filterByPublic this)}}
        {{scopeModifiers}} {{name}} {{modifiers}}    
    {{/if}}
{{/each}}
{{#each constructors as |item|}}
    {{scopeModifiers}} {{name}}({{#each parameters}}{{type}} {{name}}{{/each}}) {{returnType}} {{modifiers}}
{{/each}}
{{#each methods as |item|}}
    {{#if (filterByPublic this)}}
        {{scopeModifiers}} {{name}}({{#each parameters}}{{type}} {{name}}{{/each}}) {{returnType}} {{modifiers}}
    {{/if}}
{{/each}}
