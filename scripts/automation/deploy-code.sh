#!/bin/bash
# Script hace un deploy del codigo

# Step 1) Guardian de argumentos
green="\033[0;32m"
red="\033[0;31m"
nocolor="\033[0m"

# sf package version promote --package dreamhouse@1.0.0-1 --target-dev-hub DevHub
# sf package install --wait 10 --publish-wait 10 --package dreamhouse@1.0.0-1 --installation-key test1234 --no-prompt --target-org MyTP
