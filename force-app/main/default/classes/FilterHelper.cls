public with sharing class FilterHelper {
  private String filterObject;
  private Boolean hasTerms;
  private Map<String, List<Termino>> childTerms = new Map<String, List<Termino>>();
  private List<Termino> terms = new List<Termino>();
  private Map<String, Schema.ChildRelationship> relations =  new Map<String, Schema.ChildRelationship>();
  private Schema.DescribeSObjectResult describe;

  private void splitTerms(List<Termino> allTerms) {
    // Primero separa los childs  del resto
    for (Termino t : allTerms) {
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
            childTerms.put(relactionName, new List<Termino>{ t });
          }
        } else {
          // Todo: Verificar que la relacion exista
          this.terms.add(t);
        }
      }
    }
  }
  public FilterHelper(List<Termino> terms, String filterObject) {
    this.filterObject = filterObject;
    this.hasTerms = terms.size() > 0;

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
      for (Schema.ChildRelationship r : this.getDescribe().getChildRelationships()) {
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

        for (Termino term : childTerms.get(objectName)) {
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
    for (Termino t : this.terms) {
      whereList.add(t.toString());
    }

    return String.join(whereList, ' AND ');
  }
}
