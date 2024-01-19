public with sharing class holaMundoController {


    @AuraEnabled(cacheable=true)
    public static Integer suma(Integer numeroA, Integer numeroB) {
        
        return numeroA + numeroB;
    }

}