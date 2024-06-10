#!/bin/bash
# Script para automatizar las acciones cuando se finaliza un requerimiento
# Recibe:

script_full_path=$(dirname "$0")
source "$script_full_path/subtask/library.sh"
branchName=$(git branch --show-current)


# Obtiene del current branch los datos:
issueType=$(echo $branchName | cut -d "/" -f 1)
issueNumber=$(echo $branchName | cut -d "/" -f 2)

doInfo "No esta desarrollada esta accion"