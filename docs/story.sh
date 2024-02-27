#!/bin/bash
# Script para crear el archivo de una story


refresh="--i";
classes=("");
objects=("");

for var in "${@:2}"
do
    if [[ $var == "refresh" ]]; then 
        refresh="--o";
    else 
        if [[ $var == "{*}" ]]; then
            context=var;
        else 
            if [[ $var == *".cls" ]]; then
                classes+=($var);
            else 
                objects+=($var);
            fi
        fi
    fi

done

## Crea el archivo
modulo=$(dirname "$1")
filename=$(basename "$1")
context="{\"rol\":\"secretaria\",\"modulo\":\"$modulo\",\"titulo\":\"$filename\",\"command\":\"$0 ${@}\"}";
echo $context | yarn doc new story $1 

## Agrega los objetos
yarn doc object ${objects[@]} --m=$1 $refresh

## Agrega las clases
# yarn doc class ${classes[@]} --m=$1 $refresh



