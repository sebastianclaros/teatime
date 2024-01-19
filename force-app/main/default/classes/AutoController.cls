public with sharing class AutoController {

    @AuraEnabled(cacheable=true)
    public static List<Auto__c> getAutos() {
        return [SELECT Id, Name, Marca__c FROM Auto__c];
    }

}