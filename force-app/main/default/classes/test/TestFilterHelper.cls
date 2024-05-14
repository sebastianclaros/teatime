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
    Termino t = new Termino();
    t.field = 'Name';
    t.value = 'Test';
    terms.add(t);

    FilterHelper filter = new FilterHelper(terms, 'Product2');

    String whereString = filter.getWhereCondition();

    System.assertEquals(
      whereString,
      'Name = \'Test\'',
      'Expected to get "Field = \'Value\' "'
    );
  }

  static public List<Termino> createTerms(String termsAsString) {
    List<Termino> terms = new List<Termino>();
    List<Object> termsObject = (List<Object>) JSON.deserializeUntyped(
      termsAsString
    );
    for (Object t : termsObject) {
      Termino termino = new Termino();
      Termino termcast = (Termino) t;

      termino.field = termcast.field;
      termino.operator = termcast.operator;
      termino.value = termcast.value;
    }

    return terms;
  }

  @isTest
  static public void testConRelations() {
    String termsAsString = '[{"field": "PricebookEntries.UnitPrice","value": 1390,"operator": ">="},{"field": "PricebookEntries.UnitPrice","value": 10000, "operator": "<="}]';

    List<Termino> terms = createTerms(termsAsString);

    FilterHelper filter = new FilterHelper(terms, 'Product2');

    String whereString = filter.getWhereCondition();

    System.assertEquals(
      whereString,
      'Id IN (....)',
      'Expected to get correct wherecondition "'
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
