# Scripts de Automatizacion

## Como se ejecutan los scripts

Si estas no estas en Linux desde VS Code abrir una terminal bash.
Desde se puede ir a la carpeta scripts/automation o bien ejecutar desde la raiz del proyecto

````
./scripts/automation/start.sh <<issueNumber>> <<issueTitle>> <<days>>
````

## Al Inicial un Requerimiento

Si arrancamos de cero cuando llamamos a start, quien va a crear la branch y la scratch

start.sh (issueNumber, nombreDelRequerimiento, dias=7)
├── create-branch.sh ( issueNumber, nombreDelRequerimiento)
└── create-scracth.sh ( issueNumber, nombreDelRequerimiento, dias)
    
Por ejemplo

````
./scripts/automation/start.sh 32  bugfix-productDetail
````

Si la branch ya existe entonces solo podemos la scratch 

````
./scripts/automation/create-scratch.sh 32  bugfix-productDetail
````

Si la branch no quedo bien creada por algun error podemos llamar scratch con step
create-scracth.sh 

## Al Finalizar un Requerimiento

end.sh
├── update-doc.sh
├── validate-scratch.sh
├── validate-code.sh
├── publish-branch.sh
└── drop-scracth.sh

