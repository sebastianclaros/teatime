#!/bin/bash
# Script que valida el codigo antes de publicarlo
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

# Corre validaciondes de pmd eslint|eslint-lwc|eslint-typescript|pmd|pmd-appexchange|retire-js|sfge|cpd
#sf scanner run --engine="pmd,eslint,eslint-lwc" --format=csv --target="./force-app"

# Corre test local lwc
# yarn test

# Corre test de apex
# sf apex run test --test-level RunLocalTests --synchronous

