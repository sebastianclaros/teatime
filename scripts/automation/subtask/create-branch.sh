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
doInfo "[INICIO] de creacion de la branch $branchName"
current_branch=$(git branch --show-current)
if [ $current_branch != $branchName ]; then
    doInfo  "[STEP 1] Chequea si hay algo sin commitear"
    cambios=$(git status --porcelain=v1 2>/dev/null | wc -l)
    if [ "$cambios" -ne 0 ]; then 
        doExit  "Tiene modificaciones pendientes ($cambios)"
    fi

    exists= $(git show-ref refs/heads/$branchName)
    if [ -n "$exists" ]; then
        doInfo "[STEP 2] Si la branch existe la actualiza $exists"
        git branch $branchName
        git pull --set-upstream-to=origin/$branchName
    else
        doInfo "[STEP 2] Si no existe creamos la Branch $branchName"

        git checkout -b $branchName origin/main
        #git push -u origin $branchName

        if [ $? -ne 0 ]; then
            doExit "No se pudo crear la branch"
        fi
    fi
else 
    doWarning "* Ya esta sobre la branch $branchName"
fi

doInfo "[FIN] de creacion de la branch $branchName"
