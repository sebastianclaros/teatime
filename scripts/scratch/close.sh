#!/bin/bash
# Script crea scracth Org


# Actualiza documentacion

# Corre validaciones locales
#yarn test
current_branch=$(git branch --show-current)

# Baja lo ultimo de main y hace un merge 
if ! git checkout main; then
    echo "No pudo hacer el cambio a main"
    exit 1
fi
if ! git pull; then
    echo "No se pudo actualizar main"
    exit 1
fi

if ! git checkout $current_branch; then
    echo "No se volver a $current_branch"
    exit 1
fi

if ! git  merge main; then
    echo "No se pudo hacer el merge con main"
    exit 1
fi


# Publica la branch
if ! git push origin $current_branch; then
    echo "No se pudo publicar la branch"
    exit 1
fi
