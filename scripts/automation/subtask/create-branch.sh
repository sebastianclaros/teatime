#!/bin/bash
# Script crea una branch nueva para un requerimiento
# Recibe:
<<<<<<< HEAD
# 1) El nombre de la Branch

script_full_path=$(dirname "$0")
source "$script_full_path/library.sh"
=======
# 1) El issue Number del Repositorio
# 2) El Nombre del Requerimiento (por omision issue)

source "./library.sh"
>>>>>>> ef9984b (crear libreria)

# Step 1) Guardian de argumentos

if [ -z "$1" ]; then  
<<<<<<< HEAD
    doExit "Falta el nombre de la Branch"
else 
    branchName="$1"
fi

=======
    doExit "Falta el Issue Number"
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

>>>>>>> ef9984b (crear libreria)
# Si no esta en la branch intenta crear la branch nueva
doInfo "[INICIO] de creacion de la branch $branchName"
current_branch=$(git branch --show-current)
if [ $current_branch != $branchName ]; then
    doInfo  "[STEP 1] Chequea si hay algo sin commitear"
    cambios=$(git status --porcelain=v1 2>/dev/null | wc -l)
    if [ "$cambios" -ne 0 ]; then 
        doExit  "Tiene modificaciones pendientes ($cambios)"
    fi

<<<<<<< HEAD
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
=======
    doInfo  "[STEP 2] Nos movemos a development para hacer el branch desde esa rama"
    git checkout development    
    if [ $? -ne 0 ]; then
        doExit "No se pudo hacer el cambio de rama, verifique el mensaje de error, generalmente es porque:
            * - Tiene cosas sin comitear, haga el commit o descarte los cambios y vuelva a intentar
            * - Pruebe hacer un git fetch para ver si baja el remote localmente"
    fi

    doInfo "* [STEP 3] Hacemos un pull para bajar lo ultimo del remote"
    git pull
    if [ $? -ne 0 ]; then
        doExit "Verifique que no tenga cosas sin comitear"
    fi

    doInfo "* [STEP 4] Creamos la Branch $branchName"
    git checkout -b $branchName
    if [ $? -ne 0 ]; then
        doExit "Verifique si la branch no existe ya"
    fi
else 
    doWarning "* Ya existia la branch $branchName, asi que no se hizo nada"
>>>>>>> ef9984b (crear libreria)
fi

doInfo "[FIN] de creacion de la branch $branchName"
