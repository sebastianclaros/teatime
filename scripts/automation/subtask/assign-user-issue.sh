#!/bin/bash
# Script valida si un issue esta en una determinada columna o estado. Si esta sale con 0 sino con -1
# Recibe:
# 1) issueNumber

script_full_path=$(dirname "$0")
source "$script_full_path/library.sh"

if [ -z "$1" ]; then  
    doExit "Falta el Issue Number"
else 
    issueNumber="$1"
fi

node "$script_full_path/assign-user-issue.mjs" $issueNumber

if [ $? -ne 0 ]; then
    exit 1;
fi
