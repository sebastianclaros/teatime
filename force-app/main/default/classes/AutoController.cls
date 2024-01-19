public with sharing class AutoController {

    @AuraEnabled(cacheable=true)
    public static List<Auto__c> getAutos(String marca) {

        String query = 'SELECT Id, Name, Marca__c FROM Auto__c ';
        if ( String.isNotBlank(marca)) {
            query += ' WHERE Marca__c = :marca ';
        }
        System.debug(query);
        return Database.query(query);
    }

}