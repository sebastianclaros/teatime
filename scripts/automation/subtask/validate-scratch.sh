#!/bin/bash
# Script se fija si hay cambios en la scracth que no fueron bajados a la branch

<<<<<<< HEAD
<<<<<<< HEAD
script_full_path=$(dirname "$0")
source "$script_full_path/library.sh"
=======
source "./library.sh"
>>>>>>> ef9984b (crear libreria)
=======
script_full_path=$(dirname "$0")
source "$script_full_path/library.sh"
>>>>>>> 1198e4a (automation)

#sf project retrieve start
sf project retrieve preview
