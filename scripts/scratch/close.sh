#!/bin/bash
# Script crea scracth Org


# Actualiza documentacion

# Corre validaciones locales
yarn test

# Baja lo ultimo de main y hace un merge 
if ! git pull origin main; then
    echo "Verifique que no tenga cosas sin comitear"
    exit 1
fi
