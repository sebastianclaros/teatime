public with sharing class FilterHelper {
  private String filterObject;
  private Boolean hasTerms;
  private Map<String, List<FilterHelper.Term>> childTerms = new Map<String, List<FilterHelper.Term>>();
  private List<FilterHelper.Term> terms = new List<Term>();
  private Schema.DescribeSObjectResult describe;
  private Map<String, Schema.ChildRelationship> relations;

  private void splitTerms(List<FilterHelper.Term> allTerms) {
    // Primero separa los childs  del resto
    for (FilterHelper.Term t : allTerms) {
      List<String> splitName = t.field.split('.', 2);
      // Es field del filterObject
      if (splitName.size() == 1 || splitName.get(0) == this.filterObject) {
        // TODO: Validar que el campo exista (describe)
        this.terms.add(t);
      } else {
        String relactionName = splitName.get(0);
        if (getRelations().containsKey(relactionName)) {
          if (childTerms.containsKey(relactionName)) {
            childTerms.get(relactionName).add(t);
          } else {
            childTerms.put(relactionName, new List<Term>{ t });
          }
        } else {
          // Todo: Verificar que la relacion exista
          this.terms.add(t);
        }
      }
    }
  }

  public FilterHelper(List<Term> terms, String filterObject) {
    this.filterObject = filterObject;
    this.hasTerms = terms.size() == 0;

    if (this.hasTerms) {
      this.splitTerms(terms);
    }
  }

  private Schema.DescribeSObjectResult getDescribe() {
    if (this.describe == null) {
      //this.sObjectType = Schema.describeSObjects(new List<String>{objectName})[0].getSObjectType();
      Schema.SObjectType sObjectType = ((SObject) Type.forName(
            this.filterObject
          )
          .newInstance())
        .getSObjectType();
      this.describe = sObjectType.getDescribe();
    }
    return this.describe;
  }

  private Map<String, Schema.ChildRelationship> getRelations() {
    if (this.relations == null) {
      for (Schema.ChildRelationship r : describe.getChildRelationships()) {
        relations.put(r.getRelationshipName(), r);
      }
    }
    return this.relations;
  }

  public String getWhereCondition() {
    List<String> whereList = new List<String>();

    if (!hasTerms) {
      return '';
    }
    // Primero separa los childs  del resto
    if (childTerms.size() > 0) {
      for (String relationName : childTerms.keySet()) {
        List<String> subWhere = new List<String>();
        Schema.ChildRelationship relation = getRelations().get(relationName);
        String objectName = relation.getChildSObject().toString();
        String fielName = relation.getField().toString();

        for (Term term : childTerms.get(objectName)) {
          subWhere.add(term.toString());
        }
        whereList.add(
          'id in ( Select ' +
            fielName +
            ' FROM ' +
            objectName +
            ' WHERE ' +
            String.join(subWhere, ' AND ') +
            ')'
        );
      }
    }
    for (FilterHelper.Term t : this.terms) {
      whereList.add(t.toString());
    }

    return String.join(whereList, ' AND ');
  }

  public class Term {
    @AuraEnabled
    public String field;
    @AuraEnabled
    public Object value;
    @AuraEnabled
    public String operator = '=';

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

      // TODO: Check this types SObject, Date, Datetime, Time, List

      // treat Numbers like other types // if(this.value instanceof Integer || this.value instanceof Long || this.value instanceof Decimal || this.value instanceof Double )
      return this.value.toString();
    }

    override public String toString() {
      return this.field + ' ' + this.operator + ' ' + this.valueWithSeparator();
    }

    public Term(String field, Object value) {
      this.field = field;
      this.value = value;
    }

    public Term() {
      this.field = '';
      this.value = '';
      this.operator = '';
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
