#!/bin/bash
# Script crea los intro de cada modulo. Y si se lo llama con refresh baja primero la metadata.
# Cada vez que se agrega metadata deberia de correr de vuelta este script como "metadata refresh" para que se actualicen los intros y el cache de metadata

## GENERADOR DE OBJECTS

## Si viene refresh baja la metadata
configuracion_objects=("Auto__c");
configuracion_classes=("AutoController");

ventas_objects=("Auto__c" "Contact");
ventas_classes=("AutoController");

declare -A objects
declare -A classes
for objectName in "${configuracion_objects[@]}" "${ventas_objects[@]}"; do objects["$objectName"]=1; done
for className in "${configuracion_classes[@]}" "${ventas_classes[@]}"; do classes["$className"]=1; done
objects2=${!objects[@]}
classes2=${!classes[@]}

if [ -z "$1" ]; then  
    yarn doc:create object ${objects2[@]} --m=intro --i
    yarn doc:create class ${classes2[@]} --m=intro --i
else 
    if [ $1 = "refresh" ]; then
        yarn doc:create object ${objects2[@]} --m=intro --o
        yarn doc:create class ${classes2[@]} --m=intro --o
    fi
fi

### Configuracion
yarn doc:create object ${configuracion_objects[@]} --m=configuracion/intro --i
yarn doc:create class ${configuracion_classes[@]}  --m=configuracion/intro --i

### Ventas
yarn doc:create object ${ventas_objects[@]} --m=ventas/intro --i
yarn doc:create class ${ventas_classes[@]}  --m=ventas/intro --i
