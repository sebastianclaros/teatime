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
if ! git fetch origin; then
    echo "No pudo bajar lo ultimo"
    exit 1
fi

if ! git rebase origin/main; then
    echo "No se pudo hacer el rebase de main. Si hay conflictos resuelvalos y continue manualmente"
    exit 1
fi

# Publica la branch
if ! git push origin HEAD --force; then
    echo "No se pudo publicar la branch"
    exit 1
fi