/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 *
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class TestProductController {
  @TestSetup
  static void makeData() {
    Map<String, ProductCatalog> catalogos = new Map<String, ProductCatalog>();
    catalogos.put('Autos', new ProductCatalog(Name = 'Autos'));
    catalogos.put('Motos', new ProductCatalog(Name = 'Motos'));
    insert catalogos.values();

    Map<String, ProductCategory> categorias = new Map<String, ProductCategory>();
    categorias.put(
      'VW',
      new ProductCategory(Name = 'VW', CatalogId = catalogos.get('Autos').Id)
    );
    categorias.put(
      'Ford',
      new ProductCategory(Name = 'Ford', CatalogId = catalogos.get('Autos').Id)
    );
    categorias.put(
      'Ducati',
      new ProductCategory(
        Name = 'Ducati',
        CatalogId = catalogos.get('Motos').Id
      )
    );
    insert categorias.values();

    Map<String, Product2> productos = new Map<String, Product2>();
    productos.put('VW-Suran', new Product2(Name = 'VW Suran'));
    productos.put('Ford-Fiesta', new Product2(Name = 'Ford Fiesta'));
    productos.put('Ducati-212', new Product2(Name = 'Ducati 212'));
    insert productos.values();

    List<ProductCategoryProduct> productCategory = new List<ProductCategoryProduct>();
    productCategory.add(
      new ProductCategoryProduct(
        ProductCategoryId = categorias.get('VW').Id,
        ProductId = productos.get('VW-Suran').Id
      )
    );
    productCategory.add(
      new ProductCategoryProduct(
        ProductCategoryId = categorias.get('Ford').Id,
        ProductId = productos.get('Ford-Fiesta').Id
      )
    );
    productCategory.add(
      new ProductCategoryProduct(
        ProductCategoryId = categorias.get('Ducati').Id,
        ProductId = productos.get('Ducati-212').Id
      )
    );
    insert productCategory;
  }

  @isTest
  static void testProducts() {
    List<Termino> terms = new List<Termino>();
    Termino t = new Termino();
    t.field = 'ProductCategories.Name';
    t.value = 'VW';
    terms.add(t);

    terms.add(t);
    List<ProductController.Product> productos = ProductController.getProducts(
      terms
    );

    System.assertEquals(
      productos.size(),
      1,
      'Deberia venir un solo producto con VW'
    );
  }
}
