import { LightningElement, api } from "lwc";

export default class ProductCard extends LightningElement {
  @api product;

  hasProduct() {
    return this.product;
  }
  handleNavigateToRecord() {
    
  }
}
