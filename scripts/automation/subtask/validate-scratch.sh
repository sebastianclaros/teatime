#!/bin/bash
# Script se fija si hay cambios en la scracth que no fueron bajados a la branch

script_full_path=$(dirname "$0")
source "$script_full_path/library.sh"

#sf project retrieve start
sf project retrieve preview
