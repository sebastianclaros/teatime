@isTest
public with sharing class TestFilterHelper {

  @isTest
  static public void testVacio() {
    List<Termino> terms = new List<Termino>();

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
    List<Termino> terms = new List<Termino>();

    terms.add(new Termino('Name', 'Test'));

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
  //   List<Termino> terms = new List<Termino>();
  //   terms.add(new Termino('FieldA', 'Value'));
  //   terms.add(new Termino('FieldB', 10, '>='));
  //   terms.add(new Termino('FieldB', 20, '<='));

  //   FilterHelper filter = new FilterHelper(terms, 'Product2');
  //   String whereString = filter.getWhereCondition();

  //   System.assertEquals(
  //     whereString,
  //     'FieldA = \'Value\' AND FieldB >= 10 AND FieldB <= 20'
  //   );
  // }
}
