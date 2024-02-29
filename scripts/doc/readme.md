# Scripts de Automatizacion

## Intro

Se armo un script de comando que automatiza la documentacion y es un paraguas de los distintos tipos

Los comandos corren en modo interactivo, es decir que si no reciben parametros va a ir preguntando.

Por ejemplo el siguiente shell mostrara una lista de todos los comandos

```
yarn doc:create
```

Si se quiere correr en modo no interactivo entonces hay que pasar todos los argumentos necesarios, para ello se puede correr help para saber mas detalles.

Por ejemplo el siguiente shell mostrara un la ayuda del documentador de objetos

```
yarn doc:create object help
```

## Comandos

Cada comando trabaja con un tipo de componente de documentacion. El proceso a grandes rasgos lo que hace es conectarse a lo que llamariamos fuentes, tomar informacion que se usa dentro del template y asi generar el archivo correspondiente.

Si el archivo ya existe existe un mecanismo de merge.

Los comandos que se desarrollaron son los siguientes:

- object: Este comando usa como fuentes la metadata de objects de salesforce. Como templates tiene uno objects y otro object.

- class: Este comando usa como fuentes las clases de apex en salesforce.

- omni:

- new: Este es un comando de uso general, no se conecta a una fuente especifica, sino que recibe los datos en un archivo json, y lo combina con un template a fin de generar el archivo.
  Si no necesita el archivo, entonces es un boilerplate simple de archivos, por ejemplo un documento esqueleto para documentar una api.

Una observacion del new es que sirve para desdoblar el generado del template en los comandos anteriores. Por ejemplo si guardamos un json con los datos de objects, se puede manualmente generar templates especificos usando el new y ese json.

## Uso de los templates

Todos los templates se guardan en la carpeta templates. El comando new usa todos los md de ese root, y los comandos usan los md que estan en la subcarpeta dictionary.

## Desarrollo

La logica de cada comando esta en un helper. Por ejemplo object.js es el helper que documenta los objetos de salesforce

Por otro lado hay unas librerias comunes para el procesamiento de templates, merge de contenido y connexion a Salesforce.
