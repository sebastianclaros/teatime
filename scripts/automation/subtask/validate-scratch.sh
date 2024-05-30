#!/bin/bash
# Script se fija si hay cambios en la scracth que no fueron bajados a la branch

<<<<<<< HEAD
script_full_path=$(dirname "$0")
source "$script_full_path/library.sh"
=======
source "./library.sh"
>>>>>>> ef9984b (crear libreria)

#sf project retrieve start
sf project retrieve preview
