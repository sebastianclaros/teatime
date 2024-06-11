#!/bin/bash
# Script para listar los requerimientos
# 1) Filtro si es un numero es el issue, sino es el estado 

script_full_path=$(dirname "$0")
source "$script_full_path/subtask/library.sh"
branchName=$(git branch --show-current)

# Obtiene del current branch los datos:
issueType=$(echo $branchName | cut -d "/" -f 1)
issueNumber=$(echo $branchName | cut -d "/" -f 2)


node "$script_full_path/subtask/list-issues.mjs" issue "$issueNumber"
if [ $? -ne 0 ]; then
    exit 1;
fi
