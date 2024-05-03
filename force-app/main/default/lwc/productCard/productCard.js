import { LightningElement, api } from "lwc";

export default class ProductCard extends LightningElement {
  @api product;

  connectedCallback() {
    console.log("esto es record----->", this.product);
  }
}
