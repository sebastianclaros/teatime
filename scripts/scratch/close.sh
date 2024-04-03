#!/bin/bash
# Script crea scracth Org


# Actualiza documentacion

# Corre validaciones locales
yarn test

# Publica la branch
if ! git push origin; then
    echo "Verifique que no tenga cosas sin comitear"
    exit 1
fi

current_branch=$(git branch --show-current)

# Baja lo ultimo de main y hace un merge 
if ! git checkout main; then
    echo "Verifique que no tenga cosas sin comitear"
    exit 1
fi
if ! git pull; then
    echo "Verifique que no tenga cosas sin comitear"
    exit 1
fi
if ! git  merge --no-ff $current_branch; then
    echo "Verifique que no tenga cosas sin comitear"
    exit 1
fi


# if ! git branch -d $current_branch; then
#     echo "No se pudo eliminar la branch"
#     exit 1
# fi
