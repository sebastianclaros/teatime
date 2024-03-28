public with sharing class ProductController {
  @AuraEnabled(cacheable=true)
  public static List<Product> getProducts(String catalogId, String categoryId) {
    List<Product> products = new List<Product>();

    if (String.isNotBlank(catalogId) && String.isNotBlank(categoryId)) {
      for (ProductCategoryProduct productCategory : [
        SELECT Product.Id, Product.Name
        FROM ProductCategoryProduct
        WHERE ProductCategoryId = :categoryId AND CatalogId = :catalogId
        WITH USER_MODE
      ]) {
        products.add(new Product(productCategory.Product));
      }
    }
    return products;
  }

  @AuraEnabled(cacheable=true)
  public static List<PicklistEntry> getCategorias(String catalogId) {
    List<PicklistEntry> categorias = new List<PicklistEntry>();
    List<ProductCategory> records = [
      SELECT Id, Name
      FROM ProductCategory
      WHERE catalogId = :catalogId AND ParentCategoryId = NULL
      WITH USER_MODE
    ];
    for (ProductCategory categoria : records) {
      categorias.add(new PicklistEntry(categoria));
    }
    return categorias;
  }

  @AuraEnabled(cacheable=true)
  public static List<PicklistEntry> getCatalogos() {
    List<PicklistEntry> catalogos = new List<PicklistEntry>();
    List<ProductCatalog> records = [
      SELECT Id, Name
      FROM ProductCatalog
      WITH USER_MODE
    ];
    for (ProductCatalog catalogo : records) {
      catalogos.add(new PicklistEntry(catalogo));
    }
    return catalogos;
  }

  class Product {
    public String id;
    @AuraEnabled
    public String name;
    @AuraEnabled
    public String description;
    @AuraEnabled
    public String[] categories;
    @AuraEnabled
    public String image;
    @AuraEnabled
    public Double price;
    @AuraEnabled
    public Boolean inStock;

    public Product(SObject record) {
      this.id = (String) record.Id;
      this.name = (String) record.get('name');
    }
  }

  class PicklistEntry {
    @AuraEnabled
    public String value;
    @AuraEnabled
    public String label;

    public PicklistEntry(SObject record) {
      this.value = (String) record.Id;
      this.label = (String) record.get('name');
    }

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
