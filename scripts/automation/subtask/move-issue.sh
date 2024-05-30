#!/bin/bash
# Script mueve un issue de una columna a otra (cambio de estado)
# Recibe:
# 1) issueNumber
# 2) columna
# 3) reponsable

script_full_path=$(dirname "$0")
source "$script_full_path/library.sh"
