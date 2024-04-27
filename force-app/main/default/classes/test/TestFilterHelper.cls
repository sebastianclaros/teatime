@isTest
public with sharing class TestFilterHelper {
    
    @isTest
    static public void testSimple() {

        List<FilterHelper.Term> terms = new List<FilterHelper.Term>();
        terms.add( new FilterHelper.Term( 'Field','Value') ) ;

        String whereString = FilterHelper.getWhereCondition(terms);

        System.assertEquals(whereString, 'Field = "Value"', 'Expected to get "Field = "Value""');
    }

    @isTest
    static public void testComplex() {

        List<FilterHelper.Term> terms = new List<FilterHelper.Term>();
        terms.add( new FilterHelper.Term( 'FieldA','Value') ) ;
        terms.add( new FilterHelper.Term( 'FieldB', 10, '>=') ) ;
        terms.add( new FilterHelper.Term( 'FieldB', 20, '<=') ) ;

        String whereString = FilterHelper.getWhereCondition(terms);

        System.assertEquals(whereString, 'FieldA = "Value" AND FieldB >= 10 AND FieldB <= 20', 'Expected to get "Field = "Value""');
    }

}