#!/bin/bash
# Script que valida el codigo antes de publicarlo
source "./library.sh"

# Corre validaciondes de pmd eslint|eslint-lwc|eslint-typescript|pmd|pmd-appexchange|retire-js|sfge|cpd
#sf scanner run --engine="pmd,eslint,eslint-lwc" --format=csv --target="./force-app"

# Corre test local lwc
# yarn test

# Corre test de apex
# sf apex run test --test-level RunLocalTests --synchronous

