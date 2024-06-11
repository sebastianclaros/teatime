#!/bin/bash
# Script mueve un issue de una columna a otra (cambio de estado)
# Recibe:
# 1) issueNumber
# 2) columna

script_full_path=$(dirname "$0")
source "$script_full_path/library.sh"

if [ -z "$1" ]; then  
    doExit "Falta el Issue Number"
else 
    issueNumber="$1"
fi

if [ -z "$2" ]; then  
    doExit "Falta la Columna"
else 
    columName="$2"
fi

node "$script_full_path/move-issue.mjs" $issueNumber "$columName"
if [ $? -ne 0 ]; then
    exit 1;
fi
