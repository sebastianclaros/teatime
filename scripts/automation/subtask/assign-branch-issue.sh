#!/bin/bash
# Script valida si un issue esta en una determinada columna o estado. Si esta sale con 0 sino con -1
# Recibe:
# 1) issueNumber
# 2) branchName (optativo)

script_full_path=$(dirname "$0")
source "$script_full_path/library.sh"

if [ -z "$1" ]; then  
    doExit "Falta el Issue Number"
else 
    issueNumber="$1"
fi

if [ -z "$2" ]; then  
    current_branch=$(git branch --show-current)
else 
    current_branch="$2"
fi

if [ -z "$3" ]; then  
    commitSha=$(git rev-parse --verify main)
else 
    commitSha="$3"
fi

node "$script_full_path/assign-branch-issue.mjs" $issueNumber $current_branch $commitSha

if [ $? -ne 0 ]; then
    exit 1;
fi
