#!/bin/bash
# Script crea una branch nueva para un requerimiento
# Recibe:
<<<<<<< HEAD
# 1) El Nombre de la scracth
# 2) La cantidad de dias de la scracth  (por omision 7 y maximo 30) 

script_full_path=$(dirname "$0")
source "$script_full_path/library.sh"

projectPath="$script_full_path/../../.."
# Step 1) Guardian de argumentos
if [ -z "$1" ]; then  
    doInfo "Por omision se toma el scratchName el nombre de la branch"
    scratchName="$1"
else 
    scratchName="$1"
fi

if [ -z "$2" ]; then  
    dias=7
else 
    dias="$2"
fi

if [ -n "$2" ]; then  
    permissionSet="$2"
fi


# Variables

doInfo  "[INICIO] de crear la Scratch $scratchName"
# STEP 1 Crea la scracth org
existScracth=$(sf org list | grep $scratchName) #Verifica si existe la scratch
if [ -z "$existScracth" ]; then
    doInfo  "[STEP 1] Crear la Scratch $scratchName"
    sf org create scratch --set-default --definition-file=$projectPath/config/project-scratch-def.json --duration-days=$dias --alias=$scratchName
    if [ $? -ne 0 ]; then
        doExit "No se pudo crear la scracth org, verifique que no se haya pasado del limite scratchs (3 activas)
        * sf org list --clean
        * o bien si quedo en la mitad del proceso
        * sf org resume"
    fi
else 
    doInfo  "[STEP 1] Ya existe la Scratch $scratchName. Cambia la default org"
    sf force config set target-org $scratchName
=======
# 1) El issue Number del Repositorio
# 2) El Nombre del Requerimiento (por omision issue)
# 3) La cantidad de dias de la scracth  (por omision 7 y maximo 30) 

source "./library.sh"

# Step 1) Guardian de argumentos
if [ -z "$1" ]; then  
    doExit "Falta el Issue Number"
else 
    issueNumber="$1"
fi

if [ -z "$2" ]; then  
    requerimiento="issue"
else 
    requerimiento="$2"
fi

if [ -z "$3" ]; then  
    dias=7
else 
    dias="$3"
fi

# Variables
scratchName="$issueNumber-$requerimiento"

doInfo  "[INICIO] de crear la Scratch $scratchName"
# STEP 1 Crea la scracth org
doInfo  "[STEP 1] Crear la Scratch $scratchName"
sf org create scratch --set-default --definition-file=config/project-scratch-def.json --duration-days=$dias --alias=$scratchName
if [ $? -ne 0 ]; then
    doExit "No se pudo crear la scracth org, verifique que no se haya pasado del limite scratchs (3 activas)
     * sf org list --clean
     * o bien si quedo en la mitad del proceso
     * sf org resume"
>>>>>>> ef9984b (crear libreria)
fi

doInfo "[STEP 2] Subiendo el codigo"
sf project deploy start --target-org $scratchName
if [ $? -ne 0 ]; then
    doExit "No se pudo subir el codigo"
fi

<<<<<<< HEAD
if [ -n "$permissionSet" ]; then  
    doInfo "[STEP 3] Asignando los permisos"
    sf org assign permset --name=$permissionSet --target-org $scratchName
    if [ $? -ne 0 ]; then
        doExit "No se pudo asignar los permisos, intente manualmente"
    fi
fi

doInfo "[STEP 4] Subiendo los datos"
sf data tree import --plan=$projectPath/data/plan.json --target-org $scratchName
=======
doInfo "[STEP 3] Asignando los permisos"
sf org assign permset --name=adminCatalogo --target-org $scratchName
if [ $? -ne 0 ]; then
    doExit "No se pudo asignar los permisos, intente manualmente"
fi

doInfo "[STEP 4] Subiendo los datos"
sf data tree import --plan=data/plan.json --target-org $scratchName
>>>>>>> ef9984b (crear libreria)
if [ $? -ne 0 ]; then
    doExit "No se pudo importar los datos, intente manualmente "
fi

doInfo "[STEP 5] Seteando la scracth en modo debug"
<<<<<<< HEAD
sf apex run --file "$projectPath/scripts/apex/debugMode.apex" --target-org $scratchName
=======
sf apex run --file ./scripts/apex/debugMode.apex --target-org $scratchName
>>>>>>> ef9984b (crear libreria)
if [ $? -ne 0 ]; then
    doExit "No se pudo asignar el modo debug, intente manualmente en el user setear debug mode"
fi

doInfo "[STEP 6] Generando la password"
sf org generate password --target-org $scratchName
if [ $? -ne 0 ]; then
    doExit "No se pudo crear una password para el user "
fi


doInfo "[STEP 7] Ingresa a la scratch "
sf open org -r --target-org $scratchName
if [ $? -ne 0 ]; then
    doExit "No se pudo abrir la org, puede hacer sf org display para ver los datos y hacerlo manualmente"
fi

doInfo "[FIN] de crear la Scratch $scratchName"