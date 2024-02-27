#!/bin/bash
# Script crea los intro de cada modulo. Y si se lo llama con refresh baja primero la metadata.
# Cada vez que se agrega metadata deberia de correr de vuelta este script como "metadata refresh" para que se actualicen los intros y el cache de metadata

## GENERADOR DE OBJECTS

## Si viene refresh baja la metadata
if [ $1 = "refresh" ]; then
    yarn doc object Constancia__c Contact Programa__c Materia__c ProgramaEvaluacion__c TipoEvaluacion__c TipoEvaluacionOpcion__c CicloLectivo__c Division__c Boletin__c Asistencia__c Evaluacion__c --m=intro --o
else 
    yarn doc object Constancia__c Contact Programa__c Materia__c ProgramaEvaluacion__c TipoEvaluacion__c TipoEvaluacionOpcion__c CicloLectivo__c Division__c Boletin__c Asistencia__c Evaluacion__c --m=intro --i
fi


### Configuracion
yarn doc object Constancia__c Programa__c Materia__c ProgramaEvaluacion__c TipoEvaluacion__c TipoEvaluacionOpcion__c Grilla__c GrillaHorario__c --m=configuracion/intro --i

### Inscripcion
yarn doc object CicloLectivo__c Division__c Boletin__c Contact --m=configuracion/intro --i

### Boletines
yarn doc object Boletin__c Asistencia__c Evaluacion__c --m=boletines/intro --i


## GENERADOR DE CLASSES