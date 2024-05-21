#!/bin/bash
# Script crea una branch nueva para un requerimiento
# Recibe:
# 1) El issue Number del Repositorio
# 2) El Nombre del Requerimiento (por omision issue)

# Step 1) Guardian de argumentos
green="\033[0;32m"
red="\033[0;31m"
nocolor="\033[0m"

if [ -z "$1" ]; then  
    echo -e "{$red} Falta el Issue Number {$nocolor}"
else 
    issueNumber="$1"
fi

if [ -z "$2" ]; then  
    requerimiento="issue"
else 
    requerimiento="$2"
fi

# Variables
branchName="$issueNumber-$requerimiento"

# Si no esta en la branch intenta crear la branch nueva
echo -e "${green} * [INICIO] de creacion de la branch $branchName ${nocolor}"
current_branch=$(git branch --show-current)
if [ $current_branch != $branchName ]; then
    echo -e  "${green} * [STEP 1] Chequea si hay algo sin commitear ${nocolor}"
    cambios=$(git status --porcelain=v1 2>/dev/null | wc -l)
    if [ "$cambios" -ne 0 ]; then 
        echo -e "${red} * [ERROR] Tiene modificaciones pendientes ($cambios) ${nocolor}"
        exit 1
    fi

    echo -e  "${green}* [STEP 2] Nos movemos a development para hacer el branch desde esa rama ${nocolor}"
    git checkout development    
    if [ $? -ne 0 ]; then
        echo -e "${red} * [ERROR] No se pudo hacer el cambio de rama, verifique el mensaje de error, generalmente es porque: ${nocolor}"
        echo -e "${red} * - Tiene cosas sin comitear, haga el commit o descarte los cambios y vuelva a intentar ${nocolor}"
        echo -e "${red} * - Pruebe hacer un git fetch para ver si baja el remote localmente ${nocolor}"
        exit 1
    fi

    echo -e "${green} * [STEP 3] Hacemos un pull para bajar lo ultimo del remote ${nocolor}"
    git pull
    if [ $? -ne 0 ]; then
        echo -e "${red} * [ERROR] Verifique que no tenga cosas sin comitear ${nocolor}"
        exit 1
    fi

    echo -e "${green} * [STEP 4] Creamos la Branch $branchName ${nocolor}"
    git checkout -b $branchName
    if [ $? -ne 0 ]; then
        echo -e "${red} * [ERROR] Verifique si la branch no existe ya ${nocolor}"
        exit 1
    fi
else 
    echo -e "${red} * Ya existia la branch $branchName, asi que no se hizo nada ${nocolor}"
fi

echo -e "${green} * [FIN] de creacion de la branch $branchName ${nocolor}"
