{{#if SymbolTable.constructors}}
_Constructores_
| # | Argumentos |
| --- | ---------- |
{{#each SymbolTable.constructors}}
| <div class="icons">{{modifiers}}</div> | <ul>{{#each parameters}}<li>{{#with type}}{{linkToType}}{{/with}} {{name}}</li>{{/each}}</ul>|
{{/each}}
{{/if}}

_Metodos_
| # | Nombre | Return | Argumentos |
| --- | ------ | ------ | ---------- |
{{#each SymbolTable.methods}}
| <div class="icons">{{modifiers}}</div> | {{name}} | {{#with returnType}}{{linkToType}}{{/with}}| <ul>{{#each parameters}}<li>{{#with type}}{{linkToType}}{{/with}} {{name}}</li>{{/each}}</ul>|
{{/each}}
