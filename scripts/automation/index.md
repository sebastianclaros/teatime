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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1198e4a (automation)
* [start](#start-iniciar-un-requerimiento-nuevo)
* [stop](#stop-poner-un-requerimiento-en-pausa-para-mas-tarde-o-bien-para-que-lo-tome-otro): 
* [finish](#finish-al-terminar-el-desarrollo-de-un-requerimiento):
* [deploy](#deploy):
* [cancel](#cancel):
* [rollback](#rollback):
<<<<<<< HEAD
=======
* start:
* stop: 
* continue:
* done:
* finish:
* cancel:
>>>>>>> ef9984b (crear libreria)
=======
>>>>>>> 1198e4a (automation)


````mermaid 
stateDiagram-v2 
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1198e4a (automation)
[*] --> Ready
Ready --> InProgress : start
InProgress --> Ready :stop
InProgress --> Completed : finish
Completed --> Approved :approve
Completed --> Ready :reject
Approved --> Done : deploy
Approved --> Cancelled : cancel
<<<<<<< HEAD
InProgress --> Cancelled : cancel
Completed --> Cancelled: cancel
Cancelled --> Ready : reopen
Cancelled --> [*]
Done --> [*]
Done --> Cancelled : rollback
````

Mientras que los estados del Issue son:

````mermaid 
stateDiagram-v2 
[*] --> Open
Open --> Closed : close wont fix
Open --> Resolved :close
Closed --> Open : reopen
Resolved --> Open :reopen
Open --> Archive :archive
Archive --> Open :desarchive
Closed --> [*]
Resolved --> [*]
Archive --> [*]
````


## Start: Iniciar un Requerimiento Nuevo
=======
[*] --> InProgress : start
InProgress --> Paused :pause
Paused --> InProgress : resume
InProgress --> Done : done
Done --> Approved :approve
Done --> Paused :reject
Approved --> Deployed : finish
=======
>>>>>>> 1198e4a (automation)
InProgress --> Cancelled : cancel
Completed --> Cancelled: cancel
Cancelled --> Ready : reopen
Cancelled --> [*]
Done --> [*]
Done --> Cancelled : rollback
````

<<<<<<< HEAD
## Start: Al Inicial un Requerimiento
>>>>>>> ef9984b (crear libreria)
=======
Mientras que los estados del Issue son:

````mermaid 
stateDiagram-v2 
[*] --> Open
Open --> Closed : close wont fix
Open --> Resolved :close
Closed --> Open : reopen
Resolved --> Open :reopen
Open --> Archive :archive
Archive --> Open :desarchive
Closed --> [*]
Resolved --> [*]
Archive --> [*]
````


## Start: Iniciar un Requerimiento Nuevo
>>>>>>> 1198e4a (automation)

Si arrancamos de cero cuando llamamos a start, quien va a crear la branch y la scratch

````
<<<<<<< HEAD
<<<<<<< HEAD
start.sh (issueNumber, issueType, dias=7)
├── validate-issue.sh ( issueNumber, 'Ready')
├── create-branch.sh ( issueNumber, nombreDelRequerimiento)
├── move-issue.sh ( issueNumber, 'In Progress')
├── assign-user-issue.sh ( issueNumber, me )
├── assign-branch-issue.sh ( issueNumber, branch )
=======
start.sh (issueNumber, nombreDelRequerimiento, dias=7)
├── validate-issue.sh ( issueNumber, 'Ready')
├── create-branch.sh ( issueNumber, nombreDelRequerimiento)
├── move-issue.sh ( issueNumber, 'In Progress')
>>>>>>> ef9984b (crear libreria)
=======
start.sh (issueNumber, issueType, dias=7)
├── validate-issue.sh ( issueNumber, 'Ready')
├── create-branch.sh ( issueNumber, nombreDelRequerimiento)
├── move-issue.sh ( issueNumber, 'In Progress')
├── assign-user-issue.sh ( issueNumber, me )
├── assign-branch-issue.sh ( issueNumber, branch )
>>>>>>> 1198e4a (automation)
└── create-scracth.sh ( issueNumber, nombreDelRequerimiento, dias)
````

Por ejemplo:

````
./scripts/automation/start.sh 32  bugfix-productDetail
````
<<<<<<< HEAD
<<<<<<< HEAD
## stop: Poner un requerimiento en pausa para mas tarde o bien para que lo tome otro

````
stop.sh
├── validate-scratch.sh ()
├── move-issue.sh ( issueNumber, 'Ready')
├── label-issue.sh ( issueNumber, 'motivo')
├── comment-issue.sh ( issueNumber, 'comment')
└── publish-branch.sh
````


## finish: Completar el desarrollo de un Requerimiento

````
finish.sh
=======

## Pause: 
=======
## stop: Poner un requerimiento en pausa para mas tarde o bien para que lo tome otro
>>>>>>> 1198e4a (automation)

````
stop.sh
├── validate-scratch.sh ()
├── move-issue.sh ( issueNumber, 'Ready')
├── label-issue.sh ( issueNumber, 'motivo')
├── comment-issue.sh ( issueNumber, 'comment')
└── publish-branch.sh
````


## finish: Completar el desarrollo de un Requerimiento

````
finish.sh
├── validate-scratch.sh 
├── validate-code.sh
├── update-doc.sh
├── publish-branch.sh
├── create-pull-request.sh ('main')
├── move-issue.sh ( issueNumber, 'Completed' )
├── deploy-code.sh ( issueNumber, 'qa')
├── sanity-test.sh( 'qa')
└── drop-scracth.sh 
````

## Approve: Aprobar o validar el desarrollo del requerimiento 

````
approved.sh (issueNumber)
└── move-issue.sh ( issueNumber, 'Approved')
````

## Reject: Desaprobar o reabrir un desarrollo 

````
rejected.sh (issueNumber)
└── move-issue.sh ( issueNumber, 'Ready')
````

## Deploy: 

````
deploy.sh
├── validate-issue.sh ('Approved')  
├── deploy-code.sh( 'prod')
├── sanity-test.sh( 'prod')
├── merge-pull-request.sh( )
├── close-pull-request.sh
├── move-issue.sh ('deployed')
└── drop-branch.sh
````

<<<<<<< HEAD
## Done: Al terminar el desarrollo de un Requerimiento

````
done.sh
>>>>>>> ef9984b (crear libreria)
├── validate-scratch.sh 
├── validate-code.sh
├── update-doc.sh
├── publish-branch.sh
├── create-pull-request.sh ('main')
<<<<<<< HEAD
├── move-issue.sh ( issueNumber, 'Completed' )
├── deploy-code.sh ( issueNumber, 'qa')
├── sanity-test.sh( 'qa')
└── drop-scracth.sh 
````

## Approve: Aprobar o validar el desarrollo del requerimiento 

````
approved.sh (issueNumber)
└── move-issue.sh ( issueNumber, 'Approved')
````

## Reject: Desaprobar o reabrir un desarrollo 

````
rejected.sh (issueNumber)
└── move-issue.sh ( issueNumber, 'Ready')
````

## Deploy: 

````
deploy.sh
├── validate-issue.sh ('Approved')  
├── deploy-code.sh( 'prod')
├── sanity-test.sh( 'prod')
├── merge-pull-request.sh( )
├── close-pull-request.sh
├── move-issue.sh ('deployed')
└── drop-branch.sh
=======
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
>>>>>>> ef9984b (crear libreria)
````

=======
>>>>>>> 1198e4a (automation)
## Cancel:

````
cancelled.sh (issueNumber)
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1198e4a (automation)
├── validate-issue.sh ('Approved', 'Completed', 'Finished'  )  
├── drop-branch.sh
├── close-pull-request.sh
├── comment-pull-request.sh ( issueNumber, 'comment')
└── move-issue.sh ( issueNumber, 'Cancelled')
````
## Rollback:

````
rollback.sh (issueNumber)
├── reopen-pull-request.sh
├── revert-commit.sh
<<<<<<< HEAD
=======
├── drop-branch.sh
├── close-pull-request.sh
>>>>>>> ef9984b (crear libreria)
=======
>>>>>>> 1198e4a (automation)
└── move-issue.sh ( issueNumber, 'Cancelled')
````
