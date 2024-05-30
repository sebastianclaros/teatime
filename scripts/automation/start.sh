#!/bin/bash
# Script para automatizar las acciones cuando se arranca un requerimiento nuevo
# Recibe:
# 1) El issue Number del Repositorio. Obligatorio
# 2) El Nombre del Requerimiento. Opcional

source "$(dirname "$0")/subtastk/library.sh"

# Guardian de Argumentos
if [ -z "$1" ]; then  
    doExit( "Falta el Issue Number" );
else 
    issueNumber="$1"
fi

if [ -z "$1" ]; then  
    requerimiento="issue"
else 
    requerimiento="$2"
fi

# Variables 
script_full_path=$(dirname "$0")

##
# CUERPO DEL COMANDO
##

echo -e "${green} * [INICIO] del script de comienzo del requerimiento $branchName ${nocolor}"

# Step 1) Crea la Branch
echo -e "${green} * [CREA LA BRANCH] ${nocolor}"
$script_full_path/subtask/create-branch.sh $issueNumber $requerimiento
if [ $? -ne 0 ]; then
    exit 1;
fi

# Step 2) Crea la Scracth Org
echo -e "${green} * [CREA LA SCRATCH] ${nocolor}"
$script_full_path/subtask/create-scratch.sh $issueNumber $requerimiento 
echo -e "${green} * [FIN] del script de comienzo del requerimiento $branchName ${nocolor}"
