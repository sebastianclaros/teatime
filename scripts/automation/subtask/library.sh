#!/bin/bash

# Variables
green="\033[0;32m"
yellow="1;33[0;32m"
red="\033[0;31m"
nocolor="\033[0m"

function doExit() {
    message="$1"
    echo -e "* [ERROR] $red $message $nocolor"
    exit 1;
}

function doInfo() {
    message="$1"
    echo -e "$green $message $nocolor"
}

function doWarning() {
    message="$1"
    echo -e "$yellow $message $nocolor"
}
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1198e4a (automation)

function doError() {
    message="$1"
    echo -e "* [ERROR] $red $message $nocolor"
}
<<<<<<< HEAD
=======
>>>>>>> ef9984b (crear libreria)
=======
>>>>>>> 1198e4a (automation)
