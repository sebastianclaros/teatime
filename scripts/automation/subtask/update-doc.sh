#!/bin/bash
# Script Actualizar la documentacion

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

./docs/metadata.sh refresh
