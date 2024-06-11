#!/bin/bash
# Script Busca los datos del Issue
# Recibe:
# 1) issueNumber

script_full_path=$(dirname "$0")
source "$script_full_path/library.sh"

if [ -z "$1" ]; then  
    doExit "Falta el Issue Number"
else 
    issueNumber="$1"
fi

node "$script_full_path/list-issues.mjs" json $issueNumber 
if [ $? -ne 0 ]; then
    exit 1;
fi
