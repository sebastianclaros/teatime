#!/bin/bash
# Script que publica la branch

# Variables
green="\033[0;32m"
red="\033[0;31m"
nocolor="\033[0m"
branchName=$(git branch --show-current)


# STEP 1 Baja lo ultimo de main 
echo -e "{$red}* [STEP 1] Baja del Remote los ultimos cambios  {$nocolor}"
# Fetch de origin (baja y actualiza de github la info del repo remoto)
git fetch origin
if [ $? -ne 0 ]; then
    echo -e "{$red}* [ERROR] No pudo bajar lo ultimo {$nocolor}"
    exit 1
fi

# STEP 2: Mueve la linea del tiempo como si esta branch nace de main de ahora asi resuelve conflicto localmente
echo -e "{$red}* [STEP 2] Se deplaza al final en la linea del tiempo de Development para prevenir y resolver conflictos en el pull request(rebase)  {$nocolor}"
git rebase origin/development
if [ $? -ne 0 ]; then
    echo -e "{$red}* [ERROR] No se pudo hacer el rebase de main. Si hay conflictos resuelvalos y continue manualmente"
    exit 1
fi

# STEP 3: Publica la branch
echo -e "{$red}* [STEP 3] Publica la branch $branchName {$nocolor}"
git push origin HEAD --force
if [ $? -ne 0 ]; then
    echo -e "{$red}* [ERROR] No se pudo publicar la branch"
    exit 1
fi