#!/bin/bash
# Script Actualizar la documentacion

<<<<<<< HEAD
script_full_path=$(dirname "$0")
source "$script_full_path/library.sh"
=======
source "./library.sh"
>>>>>>> ef9984b (crear libreria)

./docs/metadata.sh refresh
