@isTest
public with sharing class TestFilterHelper {

  @isTest
  static public void testVacio() {
    List<FilterHelper.Termino> terms = new List<FilterHelper.Termino>();

    FilterHelper filter = new FilterHelper(terms, 'Account');

    String whereString = filter.getWhereCondition();

    System.assertEquals(
      whereString,
      '',
      'Expected to get "Field = \'Value\' "'
    );
  }
  @isTest
  static public void testSimple() {
    List<FilterHelper.Termino> terms = new List<FilterHelper.Termino>();

    terms.add(new FilterHelper.Term('Name', 'Test'));

    FilterHelper filter = new FilterHelper(terms, 'Account');

    String whereString = filter.getWhereCondition();

    System.assertEquals(
      whereString,
      'Name = \'Test\'',
      'Expected to get "Field = \'Value\' "'
    );
  }

  // @isTest
  // static public void testComplex() {
  //   List<FilterHelper.Term> terms = new List<FilterHelper.Term>();
  //   terms.add(new FilterHelper.Term('FieldA', 'Value'));
  //   terms.add(new FilterHelper.Term('FieldB', 10, '>='));
  //   terms.add(new FilterHelper.Term('FieldB', 20, '<='));

  //   FilterHelper filter = new FilterHelper(terms, 'Product2');
  //   String whereString = filter.getWhereCondition();

  //   System.assertEquals(
  //     whereString,
  //     'FieldA = \'Value\' AND FieldB >= 10 AND FieldB <= 20'
  //   );
  // }
}
