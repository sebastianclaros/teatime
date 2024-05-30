# Scripts de Automatizacion

## Como se ejecutan los scripts

Si estas no estas en Linux desde VS Code abrir una terminal bash.
Desde se puede ir a la carpeta scripts/automation o bien ejecutar desde la raiz del proyecto

````
./scripts/automation/start.sh <<issueNumber>> <<issueTitle>> <<days>>
````

## Acciones y subtareas

En la carpeta automation nos encontramos con scripts de acciones, que serian las acciones comunes que queremos automatizar dentro de nuestro proceso de desarrollo.

Asi identificamos las siguientes:

* start:
* stop: 
* continue:
* done:
* finish:
* cancel:


````mermaid 
stateDiagram-v2 
[*] --> InProgress : start
InProgress --> Paused :pause
Paused --> InProgress : resume
InProgress --> Done : done
Done --> Approved :approve
Done --> Paused :reject
Approved --> Deployed : finish
InProgress --> Cancelled : cancel
Done --> Cancelled: cancel
Cancelled --> [*]
Deployed --> [*]
````

## Start: Al Inicial un Requerimiento

Si arrancamos de cero cuando llamamos a start, quien va a crear la branch y la scratch

````
start.sh (issueNumber, nombreDelRequerimiento, dias=7)
├── validate-issue.sh ( issueNumber, 'Ready')
├── create-branch.sh ( issueNumber, nombreDelRequerimiento)
├── move-issue.sh ( issueNumber, 'In Progress')
└── create-scracth.sh ( issueNumber, nombreDelRequerimiento, dias)
````

Por ejemplo:

````
./scripts/automation/start.sh 32  bugfix-productDetail
````

## Pause: 

````
pause.sh
├── validate-scratch.sh ()
├── move-issue.sh ( issueNumber, 'Paused')
└── publish-branch.sh
````

## Finish: 

````
finish.sh
├── validate-issue.sh ('Approved')  
├── deploy-code.sh( 'prod')
├── sanity-test.sh( 'prod')
├── merge-pull-request.sh( )
├── close-pull-request.sh
├── move-issue.sh ('deployed')
└── drop-branch.sh
````

## Done: Al terminar el desarrollo de un Requerimiento

````
done.sh
├── validate-scratch.sh 
├── validate-code.sh
├── update-doc.sh
├── publish-branch.sh
├── create-pull-request.sh ('main')
├── move-issue.sh ( issueNumber, 'Done' )
├── deploy-code.sh ( issueNumber, 'qa')
└── drop-scracth.sh 
````

## Approve: 

````
approved.sh (issueNumber)
└── move-issue.sh ( issueNumber, 'QA')
````

## Reject: 

````
rejected.sh (issueNumber)
└── move-issue.sh ( issueNumber, 'Paused')
````

## Cancel:

````
cancelled.sh (issueNumber)
├── drop-branch.sh
├── close-pull-request.sh
└── move-issue.sh ( issueNumber, 'Cancelled')
````
