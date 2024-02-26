# Proyecto para practicar Salesforce en el equipo de Teco


Este proyecto tiene como objetivo poner en practica conocimiento que vamos aprendiendo sobre como desarrollar en Salesforce


## Modo de Trabajo

Vamos a usar el concepto de [Source Drive Development](https://trailhead.salesforce.com/content/learn/modules/sfdx_app_dev/sfdx_app_dev_setup_dx).

Basicamente lo que decimos es que nuestro "source of truth", fuente de verdad del codigo, estara en Github.

Cada uno que quiera desarrollar algo debera hacer un clone del repo, crear una [scracth org](https://trailhead.salesforce.com/content/learn/modules/sfdx_app_dev/sfdx_app_dev_setup_dx), es decir una instancia efimera de desarrollo, donde podra probar y testear, y cuando este listo hara el pull request de la funcionalidad nueva.


### Crear una DevHub

Primero de todo les pedimos que cada uno tenga su DevHub, si aun no tienen uno pueden:

1. Crear una cuenta developer que no expira nunca. [Formulario](https://developer.salesforce.com/signup)
Si necesitan una [guia paso a paso](https://www.apexhours.com/how-to-create-a-free-salesforce-developer-account/#:~:text=Go%20to%20the%20Salesforce%20Developer,Then%20Choose%20a%20unique%20username.)

2. Crear una cuenta Omni Studio Trial que expira a los 180 dias.[Formulario](https://trailhead.salesforce.com/promo/orgs/omnistudiotrails)


Una vez que tengan hagan un login en el browser y configuren:

1. Setear que la password no expire.
2. Poner la Org como DevHub


### Instalar Salesforce CLI
Saleforce CLI es la herramienta de linea de comando que nos permite subir codigo a nuestra scracth, y bajar de la misma distinto metadatos que son creados dentro de la UI de SF.

[Bajar el CLI](https://developer.salesforce.com/tools/salesforcecli?_ga=2.11139901.867475159.1706793275-450459138.1704306154)


Cualquier cosa consultar la [guia de instalacion](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_install_cli.htm)

### Setear el DevHub como default
Ahora que tienen el cli y el devhub en hagan lo siguiente

sf org login web -d -a myhuborg

### Hacer el clone del repo

Antes de bajar el Repo localmente fijense que tengan git en su compu. Sino pueden instalar [Github Desktop](https://desktop.github.com/) o bien usar por linea de comandos instalando [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

En su directorio de trabajo hagan un clone del repo

````
git clone https://github.com/sebastianclaros/teatime.git
````

cd teatime

### Crear una scract org
Vayan al directorio de teatime, y ahi con la linea de comandos va a ser crear la scracth desde nuestro DevHub

````
sf org create scratch --set-default --definition-file=config/project-scratch-def.json --duration-days=7 --alias=prueba
````

Ahora subimos el codigo

````
sf project deploy start
````

Asignamos Permisos

````
sf org assign permset --name=vendedor
````

Subimos datos 

````
sf data tree import --plan=data/plan.json
````

Abrimos la instancia de desarrollo

````
sf open
````


### Instalar Visual Studio

Como herramienta de desarrollo usaremos VS Code. 

Si no lo tienen instalado sigan [trailhead](https://trailhead.salesforce.com/es-MX/content/learn/projects/find-and-fix-bugs-with-apex-replay-debugger/apex-replay-debugger-set-up-vscode) o busquen en confluence la guia "Visual Studio Code"

Les dejo algunas extensiones utiles:

1. [Salesforce Extension Pack](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode)
2. [Salesforce Extension Pack Expanded](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode-expanded)
3. [Salesforce CLI Integration](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode-core)
4. [Replay Debugger](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode-apex-replay-debugger)
5. [Apex PMD](https://marketplace.visualstudio.com/items?itemName=chuckjonas.apex-pmd)


Ahora desde la carpeta de teatime abran el VSCode

````
code
````
