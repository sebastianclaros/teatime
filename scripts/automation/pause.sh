#!/bin/bash
# Script para automatizar las acciones cuando un requerimiento se pone en pausa.
# Es decir cuando dejo un requerimiento por la mitad, para retomarlo mas adelante, o bien que lo retome otra persona
# Recibe:
# 1) Motivo
# 2) El issue Number del Repositorio

# ├── validate-scratch.sh ()
# ├── move-issue.sh ( issueNumber, 'Ready')
# ├── label-issue.sh ( issueNumber, 'motivo')
# ├── comment-issue.sh ( issueNumber, 'comment')
# └── publish-branch.sh

source "$(dirname "$0")/subtask/library.sh"

doInfo "[MOVE ISSUE TO Ready]"
$script_full_path/subtask/move-issue.sh $issueNumber Ready 
if [ $? -ne 0 ]; then
    doExit "No se pudo mover el issue a Ready, hagalo manualmente"
fi


echo -e "${green} * [PUBLICA LA BRANCH] ${nocolor}"
$script_full_path/subtask/publish-branch.sh 
if [ $? -ne 0 ]; then
    exit 1;
fi
