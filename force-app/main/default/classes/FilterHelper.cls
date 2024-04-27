public with sharing class FilterHelper {

    public static String getWhereCondition( List<Term> terms ){
        List<String> whereList = new List<String>();
        if ( terms.size() == 0 ) {
            return '';
        }

        for ( Term term : terms ) {
            whereList.add( term.toString() );
        }
        return String.join(whereList,' AND ');
    }

    public class Term {
        public String field;
        public Object value;
        public String operator = '=';

        private String valueWithSeparator() {
            if ( this.value == null ) {
                return 'NULL';
            }

            if(this.value instanceof Boolean) {
                return (Boolean) this.value  ? 'TRUE' : 'FALSE' ;
            }

            if(this.value instanceof String || this.value instanceof Blob || this.value instanceof Id ) {
                return '"' + this.value + '"';
            }
            
            if(this.value instanceof List<String>) {
                return '( "' + String.join( (List<String>) this.value, '" , "') + '" )';    
            }
            
            // TODO: Check this types SObject, Date, Datetime, Time, List
            
            // treat Numbers like other types // if(this.value instanceof Integer || this.value instanceof Long || this.value instanceof Decimal || this.value instanceof Double ) 
            return this.value.toString();    
        }

        override public String toString() {
            return this.field +  ' ' + this.operator +  ' ' + this.valueWithSeparator();
            
        }

        public Term(String field, Object value) {
            this.field = field;
            this.value = value;
        }
        
        public Term(String field, Object value, String operator) {
            this.field = field;
            this.value = value;

            if (operator != null && operator != '') {
                this.operator = operator;
            }
        }
    }
}