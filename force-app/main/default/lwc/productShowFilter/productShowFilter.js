import { LightningElement, api, track } from "lwc";

export default class ProductShowFilter extends LightningElement {
  @api
  get filter() {
    return this.filtervalues;
  }
  set filter(value) {
    console.log(value);
    this.filtervalues = value;
  }

  @track filtervalues;

  triggerEvent(label) {
    this.dispatchEvent(new CustomEvent("remove", { detail: label }));
  }

  handleRemove(e) {
    console.log("se removió el elemento: ", e.target.label);
    this.triggerEvent(e.target.label);
  }
}
