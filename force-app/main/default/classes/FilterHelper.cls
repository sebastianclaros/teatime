public with sharing class FilterHelper {
  private String filterObject;
  private Boolean hasTerms;
  private Map<String, List<Termino>> childTerms = new Map<String, List<Termino>>();
  private List<Termino> terms = new List<Termino>();

  private Map<String, Schema.ChildRelationship> relations {
    get {
      if (relations == null) {
        relations = new Map<String, Schema.ChildRelationship>();
        for (
          Schema.ChildRelationship r : this.describe.getChildRelationships()
        ) {
          relations.put(r.getRelationshipName(), r);
        }
      }
      return relations;
    }
    set;
  }

  private Schema.DescribeSObjectResult describe {
    get {
      if (describe == null) {
        Schema.SObjectType sObjectType = ((SObject) Type.forName(
              this.filterObject
            )
            .newInstance())
          .getSObjectType();
        describe = sObjectType.getDescribe();
      }
      return describe;
    }
    set {
      describe = value;
    }
  }

  private void splitTerms(List<Termino> allTerms) {
    // Primero separa los childs  del resto
    for (Termino t : allTerms) {
      List<String> splitName = t.field.split('\\.', 2);
      // Es field del filterObject
      if (splitName.size() == 1 || splitName.get(0) == this.filterObject) {
        // TODO: Validar que el campo exista (describe)
        this.terms.add(t);
      } else {
        String relactionName = splitName.get(0);
        System.debug(relactionName);
        if (relations.containsKey(relactionName)) {
          Termino newTerm = t.clone();
          newTerm.field = splitName.get(1);
          if (childTerms.containsKey(relactionName)) {
            childTerms.get(relactionName).add(newTerm);
          } else {
            childTerms.put(relactionName, new List<Termino>{ newTerm });
          }
        } else {
          System.debug(relations.keySet());
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

  public String getWhereCondition() {
    List<String> whereList = new List<String>();

    if (!hasTerms) {
      return '';
    }

    // Primero separa los childs  del resto
    Boolean hasChildTerms = childTerms.size() > 0;
    if (hasChildTerms) {
      for (String relationName : childTerms.keySet()) {
        List<String> subWhere = new List<String>();
        Schema.ChildRelationship relation = relations.get(relationName);
        String objectName = relation.getChildSObject().toString();
        String fielName = relation.getField().toString();

        for (Termino term : childTerms.get(relationName)) {
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
