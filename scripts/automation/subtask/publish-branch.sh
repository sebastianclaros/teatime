#!/bin/bash
<<<<<<< HEAD
# Script que publica la branch actual

script_full_path=$(dirname "$0")
source "$script_full_path/library.sh"
=======
# Script que publica la branch

source "./library.sh"
>>>>>>> ef9984b (crear libreria)

# Variables
branchName=$(git branch --show-current)

# STEP 1 Baja lo ultimo de main 
doInfo "[STEP 1] Baja del Remote los ultimos cambios"
# Fetch de origin (baja y actualiza de github la info del repo remoto)
git fetch origin
if [ $? -ne 0 ]; then
    doExit "No pudo bajar lo ultimo"
fi

# STEP 2: Mueve la linea del tiempo como si esta branch nace de main de ahora asi resuelve conflicto localmente
doInfo "[STEP 2] Se deplaza al final en la linea del tiempo de Development para prevenir y resolver conflictos en el pull request(rebase)  {$nocolor}"
<<<<<<< HEAD
git rebase origin/main
=======
git rebase origin/development
>>>>>>> ef9984b (crear libreria)
if [ $? -ne 0 ]; then
    doExit "No se pudo hacer el rebase de main. Si hay conflictos resuelvalos y continue manualmente"
fi

# STEP 3: Publica la branch
doInfo "[STEP 3] Publica la branch $branchName"
git push origin HEAD --force
if [ $? -ne 0 ]; then
    doExit "No se pudo publicar la branch"
fi