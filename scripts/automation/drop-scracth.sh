#!/bin/bash
# Script que elimina la scractch
# Recibe:
# 1) El Alias de la Scratch 

# Step 1) Guardian de argumentos
green="\033[0;32m"
red="\033[0;31m"
nocolor="\033[0m"

if [ -z "$1" ]; then  
    scratchName=$(git branch --show-current)
else 
    scratchName="$1"
fi

# Si no esta en la branch intenta crear la branch nueva
echo -e "${green} * [INICIO] Eliminacion de la scracth $scratchName ${nocolor}"

sf org delete scratch --target-org $scratchName

if [ $? -ne 0 ]; then
    echo -e "${red} * [ERROR] No se pudo eliminar la scratch: ${nocolor}"
    exit 1
fi

echo -e "${green} * [FIN] Eliminacion de la scracth $scratchName ${nocolor}"
