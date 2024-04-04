#!/bin/bash
# Script crea scracth Org
if [ -z "$1" ]; then  
    echo "Falta el nombre del alias de org, generalmente el nombre del feature a realizar"
else 
    # Crea la branch nueva
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
    # Crea la scracth org
    if ! sf org create scratch --set-default --definition-file=config/project-scratch-def.json --duration-days=7 --alias=$1; then 
        echo "No se pudo crear la scracth org, puede probar de hacer sf org resume, o ver las orgs con sf org list"
        exit 1
    fi

    if ! sf project deploy start; then
        echo "No se pudo subir el codigo"
        exit 1
    fi
    if !sf org assign permset --name=adminCatalogo; then
        echo "No se pudo asignar los permisos, intente manualmente"
        exit 1
    fi

    sf data tree import --plan=data/plan.json
    sf apex run --file ./scripts/apex/debugMode.apex
    sf open org
fi

