#!/bin/bash
# Script que elimina la scractch
# Recibe:
# 1) El Alias de la Scratch 

script_full_path=$(dirname "$0")
source "$script_full_path/library.sh"

# Step 1) Guardian de argumentos
if [ -z "$1" ]; then  
    scratchName=$(git branch --show-current)
else 
    scratchName="$1"
fi

# Si no esta en la branch intenta crear la branch nueva
doInfo "* [INICIO] Eliminacion de la scracth $scratchName"

sf org delete scratch --target-org $scratchName

if [ $? -ne 0 ]; then
    doExit "* [ERROR] No se pudo eliminar la scratch"
fi

doInfo "* [FIN] Eliminacion de la scracth $scratchName"
