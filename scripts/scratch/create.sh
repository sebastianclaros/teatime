#!/bin/bash
# Script crea scracth Org

if [ -z "$1" ]; then  
ull    echo "Falta el nombre del alias de org, generalmente el nombre del feature a realizar"
else 
    if ! git checkout main; then
        echo "Verifique que no tenga cosas sin comitear, no se puede crear una branch con cambios sin commitear, o bien los debera deshacer"
        exit 1
    fi
    if ! git pull; then
        echo "Verifique que no tenga cosas sin comitear"
        exit 1
    fi
    if ! git checkout -b $1; then
        echo "Verifique que no tenga cosas sin comitear"
        exit 1
    fi
    # sf org create scratch --set-default --definition-file=config/project-scratch-def.json --duration-days=7 --alias=$1
    # sf project deploy start
    # sf org assign permset --name=adminCatalogo
    # sf data tree import --plan=data/plan.json
    # sf apex run --file ./scripts/apex/debugMode.apex
    # sf open org
fi

