#!/bin/bash
# Script para automatizar las acciones cuando se termina un requerimiento

# Variables
green="\033[0;32m"
red="\033[0;31m"
nocolor="\033[0m"
branchName=$(git branch --show-current)
script_full_path=$(dirname "$0")

##
# CUERPO DEL COMANDO
##

# Si no esta en la branch intenta crear la branch nueva
echo -e "${green} * [INICIO] del script de finalizacion de un requerimiento $branchName ${nocolor}"

# Step 1) Actualiza la documentacion
echo -e "${green} * [UPDATE DOCUMENTACION] ${nocolor}"
$script_full_path/update-doc.sh 
if [ $? -ne 0 ]; then
    exit 1;
fi

# Step 2) Valida si la scracth tiene cambios y no fueron bajados al repo 
echo -e "${green} * [VALIDA SCRATCH NO TENGA CAMBIOS] ${nocolor}"
$script_full_path/validate-scratch.sh $branchName
if [ $? -ne 0 ]; then
    exit 1;
fi

# Step 3) 
echo -e "${green} * [VALIDA CODIGO] ${nocolor}"
$script_full_path/validate-code.sh 
if [ $? -ne 0 ]; then
    exit 1;
fi

# Step 4) 
echo -e "${green} * [PUBLICA LA BRANCH] ${nocolor}"
$script_full_path/publish-branch.sh 
if [ $? -ne 0 ]; then
    exit 1;
fi

# Step 5) 
echo -e "${green} * [ELIMINA LA SCRATCH] ${nocolor}"
$script_full_path/drop-scratch.sh 

echo -e "${green} * [FIN] del script de finalizacion del requerimiento $branchName ${nocolor}"
