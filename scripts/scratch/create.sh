#!/bin/bash
# Script crea scracth Org

if [ -z "$1" ]; then  
ull    echo "Falta el nombre del alias de org, generalmente el nombre del feature a realizar"
else 
    sf org create scratch --set-default --definition-file=config/project-scratch-def.json --duration-days=7 --alias=$1
    sf project deploy start
    sf org assign permset --name=adminCatalogo
    sf data tree import --plan=data/plan.json
    sf apex run --file ./scripts/apex/debugMode.apex
    git checkout main
    git pull
    git checkout -b $1
    sf open org
fi

