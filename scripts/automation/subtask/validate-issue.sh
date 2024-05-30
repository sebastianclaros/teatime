#!/bin/bash
# Script valida si un issue esta en una determinada columna o estado. Si esta sale con 0 sino con -1
# Recibe:
# 1) issueNumber
# 2) columnName

script_full_path=$(dirname "$0")
source "$script_full_path/library.sh"

if [ -z "$1" ]; then  
    doExit "Falta el Issue Number"
else 
    issueNumber="$1"
fi

if [ -z "$2" ]; then  
    doExit "Falta la columnName"
else 
    columName="$2"
fi


node "$script_full_path/validate-issue.mjs" $issueNumber $columName

if [ $? -ne 0 ]; then
    exit 1;
fi
