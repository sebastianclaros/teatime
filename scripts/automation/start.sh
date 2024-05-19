#!/bin/bash
# Script para automatizar las acciones cuando se arranca un requerimiento nuevo
# Recibe:
# 1) El issue Number del Repositorio
# 2) El Nombre del Requerimiento 

# Guardian de Argumentos
green="\033[0;32m"
red="\033[0;31m"
nocolor="\033[0m"

if [ -z "$1" ]; then  
    echo -e "{$red} Falta el Issue Number {$nocolor}"
    exit 1;
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
$script_full_path/create-branch.sh $issueNumber $requerimiento
if [ $? -ne 0 ]; then
    exit 1;
fi

# Step 2) Crea la Scracth Org
echo -e "${green} * [CREA LA SCRATCH] ${nocolor}"
$script_full_path/create-scratch.sh $issueNumber $requerimiento 
echo -e "${green} * [FIN] del script de comienzo del requerimiento $branchName ${nocolor}"
