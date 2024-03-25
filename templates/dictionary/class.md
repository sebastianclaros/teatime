---
title: {{Name}}
---

## Introducción

<!-- START autogenerated-class -->
## Descripción

{{description}}

- Status: {{Status}}
- Api Version: {{ApiVersion}}
- Creada: {{#with CreatedDate}}{{verFecha}}{{/with}}
- Modificada: {{#with LastModifiedDate}}{{verFecha}}{{/with}}
- Interface 
    {{#each SymbolTable.interfaces}}
        * [{{this}}](/diccionarios/classes/{{this}})
    {{/each}}

## Diagrama
{{import class-diagrama.md}}

### Metodos
{{import class-metodos.md}}

{{import class-referencias.md}}
<!-- END autogenerated-class -->