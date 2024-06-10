#!/bin/bash
# Script para automatizar las acciones cuando se termina el desarrollo de un requerimiento

script_full_path=$(dirname "$0")
source "$script_full_path/subtask/library.sh"
branchName=$(git branch --show-current)
# Recibe:

# Obtiene del current branch los datos:
issueType=$(echo $branchName | cut -d "/" -f 1)
issueNumber=$(echo $branchName | cut -d "/" -f 2)

# finish.sh
# ├── validate-scratch.sh 
# ├── validate-code.sh
# ├── update-doc.sh
# ├── publish-branch.sh
# ├── create-pull-request.sh ('main')
# ├── move-issue.sh ( issueNumber, 'Completed' )
# ├── deploy-code.sh ( issueNumber, 'qa')
# ├── sanity-test.sh( 'qa')
# └── drop-scracth.sh 

# Variables

##
# CUERPO DEL COMANDO
##

# Si no esta en la branch intenta crear la branch nueva
echo -e "${green} * [INICIO] del script de finalizacion de un requerimiento $branchName ${nocolor}"

# Step 1) Actualiza la documentacion
echo -e "${green} * [UPDATE DOCUMENTACION] ${nocolor}"
$script_full_path/subtask/update-doc.sh 
if [ $? -ne 0 ]; then
    exit 1;
fi

# Step 2) Valida si la scracth tiene cambios y no fueron bajados al repo 
echo -e "${green} * [VALIDA SCRATCH NO TENGA CAMBIOS] ${nocolor}"
$script_full_path/subtask/validate-scratch.sh $branchName
if [ $? -ne 0 ]; then
    exit 1;
fi

# Step 3) 
echo -e "${green} * [VALIDA CODIGO] ${nocolor}"
$script_full_path/subtask/validate-code.sh 
if [ $? -ne 0 ]; then
    exit 1;
fi

# Step 4) 
echo -e "${green} * [PUBLICA LA BRANCH] ${nocolor}"
$script_full_path/subtask/publish-branch.sh 
if [ $? -ne 0 ]; then
    exit 1;
fi

# Step 5) 
echo -e "${green} * [ELIMINA LA SCRATCH] ${nocolor}"
$script_full_path/subtask/drop-scratch.sh 

echo -e "${green} * [FIN] del script de finalizacion del requerimiento $branchName ${nocolor}"
