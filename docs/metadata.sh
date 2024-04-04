#!/bin/bash
# Script crea los intro de cada modulo. Y si se lo llama con refresh baja primero la metadata.
# Cada vez que se agrega metadata deberia de correr de vuelta este script como "metadata refresh" para que se actualicen los intros y el cache de metadata

## GENERADOR DE OBJECTS

## Si viene refresh baja la metadata
configuracion_objects=("Product2" "ProductCatalog" "ProductCategory" "ProductCategoryProduct" "PriceBook2" "PriceBookEntry" );
configuracion_classes=("ProductController");

ventas_objects=("Order" "Contact");
ventas_classes=("OrderController");

declare -A objects
declare -A classes
for objectName in "${configuracion_objects[@]}" "${ventas_objects[@]}"; do objects["$objectName"]=1; done
for className in "${configuracion_classes[@]}" "${ventas_classes[@]}"; do classes["$className"]=1; done
objectsAll=${!objects[@]}
classesAll=${!classes[@]}

if [ -z "$1" ]; then  
    yarn doc:create object ${objectsAll[@]} --m=./docs/intro --i
    yarn doc:create class ${classesAll[@]} --m=./docs/intro --i
else 
    if [ $1 = "refresh" ]; then
        yarn doc:create object ${objectsAll[@]} --m=./docs/intro --o
        yarn doc:create class ${classesAll[@]} --m=./docs/intro --o
    fi
fi

### Configuracion
yarn doc:create object ${configuracion_objects[@]} --m=./docs/configuracion/intro --i
yarn doc:create class ${configuracion_classes[@]}  --m=./docs/configuracion/intro --i

### Ventas
yarn doc:create object ${ventas_objects[@]} --m=./docs/ventas/intro --i
yarn doc:create class ${ventas_classes[@]}  --m=./docs/ventas/intro --i
