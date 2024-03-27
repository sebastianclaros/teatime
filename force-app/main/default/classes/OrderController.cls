public with sharing class OrderController {
  @AuraEnabled(cacheable=true)
  public static Order getOrder(String orderId) {
    List<Order> orders = [
      SELECT Id, OrderNumber, AccountId
      FROM Order
      WHERE Id = :orderId
      WITH USER_MODE
    ];
    System.debug(orderId);
    return orders.size() > 0 ? orders.get(0) : null;
  }
}
