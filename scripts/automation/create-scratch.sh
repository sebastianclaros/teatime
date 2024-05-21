#!/bin/bash
# Script crea una branch nueva para un requerimiento
# Recibe:
# 1) El issue Number del Repositorio
# 2) El Nombre del Requerimiento (por omision issue)
# 3) La cantidad de dias de la scracth  (por omision 7 y maximo 30) 

# Step 1) Guardian de argumentos
green="\033[0;32m"
red="\033[0;31m"
nocolor="\033[0m"

if [ -z "$1" ]; then  
    echo -e "{$red} Falta el Issue Number {$nocolor}"
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

echo -e  "${green} *  [INICIO] de crear la Scratch $scratchName  ${nocolor}"
# STEP 1 Crea la scracth org
echo -e  "${green} *  [STEP 1] Crear la Scratch $scratchName  ${nocolor}"
sf org create scratch --set-default --definition-file=config/project-scratch-def.json --duration-days=$dias --alias=$scratchName
if [ $? -ne 0 ]; then
    echo -e "${red} *[ERROR] No se pudo crear la scracth org, verifique que no se haya pasado del limite scratchs (3 activas) ${nocolor}"
    echo -e "${red} * sf org list --clean  ${nocolor}"
    echo -e "${red} * o bien si quedo en la mitad del proceso ${nocolor}"
    echo -e "${red} * sf org resume  ${nocolor}"
    exit 1
fi

echo -e  "${green} * [STEP 2] Subiendo el codigo  ${nocolor}"
sf project deploy start --target-org $scratchName
if [ $? -ne 0 ]; then
    echo -e "${red} *[ERROR] No se pudo subir el codigo ${nocolor}"
    exit 1
fi

echo -e  "${green} * [STEP 3] Asignando los permisos  ${nocolor}"
sf org assign permset --name=adminCatalogo --target-org $scratchName
if [ $? -ne 0 ]; then
    echo -e "${red} * [ERROR] No se pudo asignar los permisos, intente manualmente ${nocolor}"
    exit 1
fi

echo -e  "${green} * [STEP 4] Subiendo los datos  ${nocolor}"
sf data tree import --plan=data/plan.json --target-org $scratchName
if [ $? -ne 0 ]; then
    echo -e "${red} *[ERROR] No se pudo importar los datos, intente manualmente ${nocolor}"
    exit 1
fi

echo -e  "${green} * [STEP 5] Seteando la scracth en modo debug  ${nocolor}"
sf apex run --file ./scripts/apex/debugMode.apex --target-org $scratchName
if [ $? -ne 0 ]; then
    echo -e "${red} * [ERROR] No se pudo asignar el modo debug, intente manualmente en el user setear debug mode  ${nocolor}"
fi

echo -e  "${green} * [STEP 6] Generando la password  ${nocolor}"
sf org generate password --target-org $scratchName
if [ $? -ne 0 ]; then
    echo -e "${red} * [ERROR] No se pudo crear una password para el user ${nocolor}"
fi


echo -e  "${green} * [STEP 7] Ingresa a la scratch ${nocolor}"
sf open org -r --target-org $scratchName
if [ $? -ne 0 ]; then
    echo -e "${red} * [ERROR] No se pudo abrir la org, puede hacer sf org display para ver los datos y hacerlo manualmente ${nocolor}"
fi

echo -e  "${green} * [FIN] de crear la Scratch $scratchName  ${nocolor}"
