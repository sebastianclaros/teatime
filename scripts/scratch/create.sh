#!/bin/bash
# Script crea scracth Org


if [ -z "$2" ]; then
    dias=7
else 
    dias="$2"
fi

if [ -z "$1" ]; then  
    echo "Falta el nombre del alias de org, generalmente el nombre del feature a realizar"
else 
    # Crea la branch nueva
    git checkout main    
    if [ $? -ne 0 ]; then
        echo "Verifique que no tenga cosas sin comitear, no se puede crear una branch con cambios sin commitear, o bien los debera deshacer"
        exit 1
    fi
    git pull
    if [ $? -ne 0 ]; then
        echo "Verifique que no tenga cosas sin comitear"
        exit 1
    fi
    git checkout -b $1
    if [ $? -ne 0 ]; then
        echo "Verifique que no tenga cosas sin comitear"
        exit 1
    fi
    # Crea la scracth org
    sf org create scratch --set-default --definition-file=config/project-scratch-def.json --duration-days=$dias --alias=$1
    if [ $? -ne 0 ]; then
        echo "No se pudo crear la scracth org, puede probar de hacer sf org resume, o ver las orgs con sf org list --clean (recuerde que no se úede tener mas de 3 activas)"
        exit 1
    fi

    sf project deploy start
    if [ $? -ne 0 ]; then
        echo "No se pudo subir el codigo"
        exit 1
    fi

    sf org assign permset --name=adminCatalogo
    if [ $? -ne 0 ]; then
        echo "No se pudo asignar los permisos, intente manualmente"
        exit 1
    fi

    sf data tree import --plan=data/plan.json
    if [ $? -ne 0 ]; then
        echo "No se pudo importar los datos, intente manualmente"
        exit 1
    fi
    
    sf org generate password
    if [ $? -ne 0 ]; then
        echo "No se pudo crear una password para el user"
    fi

    sf apex run --file ./scripts/apex/debugMode.apex
    if [ $? -ne 0 ]; then
        echo "No se pudo asignar el modo debug, intente manualmente en el user setear debug mode "
    fi

    sf open org -r
    if [ $? -ne 0 ]; then
        echo "No se pudo abrir la org, puede hacer sf org display para ver los datos y hacerlo manualmente"
    fi
fi