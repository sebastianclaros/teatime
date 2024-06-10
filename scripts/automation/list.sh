#!/bin/bash
# Script para listar los requerimientos
# 1) Filtro si es un numero es el issue, sino es el estado 

script_full_path=$(dirname "$0")
source "$script_full_path/subtask/library.sh"

# Guardian de Argumentos

if [ -z "$1" ]; then  
    filterType="mine"
else 
    re='^[0-9]+$'
    if ! [[ $yournumber =~ $re ]] ; then
        filterType="issue"
    else
        filterType="state"
    fi
    filterValue="$1"
fi

node "$script_full_path/subtask/list-issues.mjs" $filterType "$filterValue"
if [ $? -ne 0 ]; then
    exit 1;
fi
