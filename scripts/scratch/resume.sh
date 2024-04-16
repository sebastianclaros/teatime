#!/bin/bash
# Script crea scracth Org
if [ -z "$1" ]; then
    step=1
else 
    step="$1"
fi

# Crea la scracth org

if [ $step -le 1 ]; then
    sf org resume scratch --use-most-recent
    if [ $? -ne 0 ]; then
        echo "No se pudo crear la scracth org, puede probar de hacer sf org resume, o ver las orgs con sf org list --clean (recuerde que no se úede tener mas de 3 activas)"
        exit 1
    fi
fi

if [ $step -le 2 ]; then
    sf project deploy start
    if [ $? -ne 0 ]; then
        echo "No se pudo subir el codigo"
        echo "Despues de resolverlo puede continuar con resume.sh 2"        
        exit 1
    fi
fi

if [ $step -le 3 ]; then
    sf org assign permset --name=adminCatalogo
    if [ $? -ne 0 ]; then
        echo "No se pudo asignar los permisos, intente manualmente"
        echo "Despues de resolverlo puede continuar con resume.sh 3"        
        exit 1
    fi
fi

if [ $step -le 4 ]; then
    sf data tree import --plan=data/plan.json
    if [ $? -ne 0 ]; then
        echo "No se pudo importar los datos, intente manualmente"
        echo "Despues de resolverlo puede continuar con resume.sh 4"        
        exit 1
    fi
fi

if [ $step -le 5 ]; then
    sf apex run --file ./scripts/apex/debugMode.apex
    if [ $? -ne 0 ]; then
        echo "No se pudo asignar el modo debug, intente manualmente en el user setear debug mode "
        echo "ejecute nuevamente con resume.sh 5" 
        exit 1
    fi
fi

if [ $step -le 6 ]; then
    sf force:org:open -r
    if [ $? -ne 0 ]; then
        echo "ejecute nuevamente con resume.sh 6" 
        exit 1
    fi
fi