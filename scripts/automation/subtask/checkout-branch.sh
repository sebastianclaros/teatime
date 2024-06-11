#!/bin/bash
# Script crea una branch nueva para un requerimiento
# Recibe:
# 1) El nombre de la Branch

script_full_path=$(dirname "$0")
source "$script_full_path/library.sh"

# Step 1) Guardian de argumentos

if [ -z "$1" ]; then  
    doExit "Falta el nombre de la Branch"
else 
    branchName="$1"
fi

# Si no esta en la branch intenta crear la branch nueva
doInfo "[INICIO] de Checkout de la branch $branchName"
current_branch=$(git branch --show-current)
if [ $current_branch != $branchName ]; then
    doInfo  "[STEP 1] Chequea si hay algo sin commitear"
    cambios=$(git status --porcelain=v1 2>/dev/null | wc -l)
    if [ "$cambios" -ne 0 ]; then 
        doExit  "Tiene modificaciones pendientes ($cambios)"
    fi

    doInfo  "[STEP 2] Nos movemos a branch $branchName"
    git checkout $branchName
    if [ $? -ne 0 ]; then
        doExit "No se pudo hacer el cambio de rama, verifique el mensaje de error, generalmente es porque:
            * - Tiene cosas sin comitear, haga el commit o descarte los cambios y vuelva a intentar
            * - Pruebe hacer un git fetch para ver si baja el remote localmente"
    fi

    doInfo "* [STEP 3] Hacemos un pull para bajar lo ultimo"
    git pull
    if [ $? -ne 0 ]; then
        doExit "Verifique que no tenga cosas sin comitear"
    fi

    #doInfo "* [STEP 4] Hacemos un rebase de main"
    
else 
    doWarning "* Ya esta sobre la branch $branchName"
    git pull
fi

doInfo "[FIN] de creacion de la branch $branchName"
