#!/bin/bash
# Script hace un deploy del codigo

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

# Step 1) Guardian de argumentos

# sf package version promote --package dreamhouse@1.0.0-1 --target-dev-hub DevHub
# sf package install --wait 10 --publish-wait 10 --package dreamhouse@1.0.0-1 --installation-key test1234 --no-prompt --target-org MyTP


json=$(sf package version create --package Ventas --installation-key-bypass --wait 20 --definition-file config/project-scratch-def.json --json)
status=$(echo $json | jq '.status')
if [ $status == "0" ]; then
    packageVersionId=$(echo $json | jq -r '.result.SubscriberPackageVersionId')
    echo "packageVersionId=$packageVersionId" >> $GITHUB_OUTPUT
else
    echo "Failed to create package version"
fi
exit $status

sleep 360

sf org create scratch -f config/project-scratch-def.json -a scratch-org -d -y 1

sf package install -p $packageVersionId -w 10 -o scratch-org -r
