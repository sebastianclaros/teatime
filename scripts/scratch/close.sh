#!/bin/bash
# Script crea scracth Org

# Actualiza documentacion
#./docs/metadata.sh refresh

# Corre validaciondes de pmd eslint|eslint-lwc|eslint-typescript|pmd|pmd-appexchange|retire-js|sfge|cpd
#sf scanner run --engine="pmd,eslint,eslint-lwc" --format=csv --target="./force-app"

# Corre test local lwc
# yarn test

# Corre test de apex
# sf apex run test --test-level RunLocalTests --synchronous

current_branch=$(git branch --show-current)
# Baja lo ultimo de main 
if ! git checkout main; then
    echo "No pudo hacer el cambio a main"
    exit 1
fi
if ! git pull; then
    echo "No se pudo actualizar main"
    exit 1
fi

# Vuelve a la branch y trata de hacer el merge
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