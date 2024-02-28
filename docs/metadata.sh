#!/bin/bash
# Script crea los intro de cada modulo. Y si se lo llama con refresh baja primero la metadata.
# Cada vez que se agrega metadata deberia de correr de vuelta este script como "metadata refresh" para que se actualicen los intros y el cache de metadata

## GENERADOR DE OBJECTS

## Si viene refresh baja la metadata
if [ $1 = "refresh" ]; then
    yarn doc:create object Constancia__c Contact Programa__c Materia__c ProgramaEvaluacion__c TipoEvaluacion__c TipoEvaluacionOpcion__c CicloLectivo__c Division__c Boletin__c Asistencia__c Evaluacion__c --m=intro --o
else 
    yarn doc:create object Constancia__c Contact Programa__c Materia__c ProgramaEvaluacion__c TipoEvaluacion__c TipoEvaluacionOpcion__c CicloLectivo__c Division__c Boletin__c Asistencia__c Evaluacion__c --m=intro --i
fi


### Configuracion
yarn doc:create object Auto __c --m=configuracion/intro --i
yarn doc:create class AutoController --m=ventas/intro --i

### Ventas
yarn doc:create object Auto __c Contact --m=ventas/intro --i
