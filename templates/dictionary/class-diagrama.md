```mermaid
classDiagram

{{#if parentClass}}
    {{parentClass}} <|-- {{Name}}
{{/if}}
class {{Name}} {
    {{#with SymbolTable}}
        {{import class-all}}
    {{/with}}
}
```
