#!/bin/bash
# Script para automatizar las acciones cuando un requerimiento se pone en pausa.
# Es decir cuando dejo un requerimiento por la mitad, para retomarlo mas adelante, o bien que lo retome otra persona
# Recibe:
# 1) Motivo (dependencia, refinamiento, tiempo) o Comentario  

# ├── validate-scratch.sh ()
# ├── move-issue.sh ( issueNumber, 'Ready' o 'Backlog')
# ├── label-issue.sh ( issueNumber, 'motivo')
# ├── comment-issue.sh ( issueNumber, 'comment')
# └── publish-branch.sh

script_full_path=$(dirname "$0")
source "$script_full_path/subtask/library.sh"
branchName=$(git branch --show-current)

# Guardian de Argumentos
if [ -z "$1" ]; then  
    # doExit "Falta el Motivo (tiempo, dependencia o refinamiento), o bien un comentario" ;
    motivo="tiempo"
else 
    if [ "$1" == "tiempo" ] || [ "$1" == "refinamiento" ] || [ "$1" == "dependencia" ]; then  
        motivo="$1"
    else
        comentario="$1" 
    fi
fi

# Obtiene del current branch los datos:
issueType=$(echo $branchName | cut -d "/" -f 1)
issueNumber=$(echo $branchName | cut -d "/" -f 2)


# VALIDATE issueNumber is correct 
if [ -z "$issueNumber" ]; then
    doExit "No se pudo obtener el issueNumber  de la current branch $branchName. Verifique que el formato sea issueType/issuNumber"
fi


doInfo "[MOVE ISSUE TO Ready]"
$script_full_path/subtask/move-issue.sh $issueNumber Ready 
if [ $? -ne 0 ]; then
    doError "No se pudo mover el issue a Ready, hagalo manualmente"
fi

echo -e "${green} * [PUBLICA LA BRANCH] ${nocolor}"
$script_full_path/subtask/publish-branch.sh 
if [ $? -ne 0 ]; then
    exit 1;
fi

if [ ! -z "$motivo" ]; then
    doInfo "[Pone el label del motivo en el Issue]"
fi

if [ ! -z "$comentario" ]; then
    doInfo "[Pone el commentario en el Issue]"
fi

