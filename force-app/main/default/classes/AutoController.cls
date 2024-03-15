public with sharing class AutoController {
  @AuraEnabled
  public static void saveAuto2(String marca, String Name) {
    Auto__c auto = new Auto__c(Marca__c = marca, Name = name);
    Database.upsert(auto);
  }

  @AuraEnabled(cacheable=true)
  public static List<Auto__c> getAutos(String marca) {
    String query = 'SELECT Id, Name, Marca__c FROM Auto__c ';
    if (String.isNotBlank(marca)) {
      query += ' WHERE Marca__c = :marca ';
    }
    System.debug(query);
    return Database.query(query);
  }

  @AuraEnabled(cacheable=true)
  public static List<PicklistEntry> getFamilias() {
    Schema.DescribeFieldResult fieldDescribe = Product2.Family.getDescribe();
    List<PicklistEntry> familias = new List<PicklistEntry>();
    for (Schema.PicklistEntry entry : fieldDescribe.getPicklistValues()) {
      familias.add(new PicklistEntry(entry));
    }
    return familias;
  }

  class PicklistEntry {
    @AuraEnabled
    public String value;
    @AuraEnabled
    public String label;

    public PicklistEntry(Schema.PicklistEntry entry) {
      this.value = entry.value;
      this.label = entry.label;
    }

    public PicklistEntry(String value, String label) {
      this.value = value;
      this.label = label;
    }
  }
}
