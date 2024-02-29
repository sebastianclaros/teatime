{{#each properties}}
    {{scopeModifiers}} {{name}} {{modifiers}}    
{{/each}}    
{{#each constructors as |item|}}
    {{scopeModifiers}} {{name}}({{#each parameters}}{{type}} {{name}}{{/each}}) {{returnType}} {{modifiers}}
{{/each}}
{{#each methods as |item|}}
    {{scopeModifiers}} {{name}}({{#each parameters}}{{type}} {{name}}{{/each}}) {{returnType}} {{modifiers}}
{{/each}}
