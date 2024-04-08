@echo off

IF "-z" "%~1" (
  echo "Falta el nombre del alias de org, generalmente el nombre del feature a realizar"
) ELSE (
  IF ! "git" "checkout" "main" (
    echo "Verifique que no tenga cosas sin comitear, no se puede crear una branch con cambios sin commitear, o bien los debera deshacer"
    exit "1"
  )
  IF ! "git" "pull" (
    echo "Verifique que no tenga cosas sin comitear"
    exit "1"
  )
  IF ! "git" "checkout" "-b" "%~1" (
    echo "Verifique que no tenga cosas sin comitear"
    exit "1"
  )
  IF ! "sf" "org" "create" "scratch" "--set-default" "--definition-file=config\project-scratch-def.json" "--duration-days=7" "--alias=%~1" (
    echo "No se pudo crear la scracth org, puede probar de hacer sf org resume, o ver las orgs con sf org list --clean (recuerde que no se úede tener mas de 3 activas)"
    exit "1"
  )
  IF ! "sf" "project" "deploy" "start" (
    echo "No se pudo subir el codigo"
    exit "1"
  )
  IF !sf "org" "assign" "permset" "--name=adminCatalogo" (
    echo "No se pudo asignar los permisos, intente manualmente"
    exit "1"
  )
  IF !sf "data" "tree" "import" "--plan=data\plan.json" (
    echo "No se pudo importar los datos, intente manualmente"
    exit "1"
  )
  IF !sf "apex" "run" "--file" "%CD%\scripts\apex\debugMode.apex" (
    echo "No se pudo asignar el modo debug, intente manualmente en el user setear debug mode "
    exit "1"
  )
  IF !sf "open" "org" (
    exit "1"
  )
)