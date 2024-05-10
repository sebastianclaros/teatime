public class Termino {
    @AuraEnabled
    public String field {get; set; }
    @AuraEnabled
    public Object value { get; set; }
    @AuraEnabled
    public String operator { get; set; }

    private String valueWithSeparator() {
      if (this.value == null) {
        return 'NULL';
      }

      if (this.value instanceof Boolean) {
        return (Boolean) this.value ? 'TRUE' : 'FALSE';
      }

      if (
        this.value instanceof String ||
        this.value instanceof Blob ||
        this.value instanceof Id
      ) {
        return '\'' + this.value + '\'';
      }

      if (this.value instanceof List<String>) {
        return '( "' + String.join((List<String>) this.value, '" , "') + '" )';
      }

//      TODO: Check this types SObject, Date, Datetime, Time, List
//      treat Numbers like other types 
// if(this.value instanceof Integer || this.value instanceof Long || this.value instanceof Decimal || this.value instanceof Double )
      return this.value.toString();
    }

    override public String toString() {
      return this.field + ' ' + this.operator + ' ' + this.valueWithSeparator();
    }
  }
