import { LightningElement, track, api } from "lwc";

export default class FilterPrice extends LightningElement {
  @track minRange = 0;
  @track maxRange = 10000;
  @api pricebookId;

  triggerEvent() {
    this.dispatchEvent(new CustomEvent("filter", { detail: this.filter }));
  }

  get filter() {
    return [
      {
        field: "PricebookEntries.UnitPrice",
        value: this.minRange,
        operator: ">="
      },
      {
        field: "PricebookEntries.UnitPrice",
        value: this.maxRange,
        operator: "<="
      }
    ];
  }

  handleApply() {
    this.triggerEvent();
  }
  handleMinRange(event) {
    const newValue = Number(event.target.value);
    if (newValue >= this.maxRange) {
      this.maxRange = newValue;
    }
    this.minRange = newValue;
  }

  handleMaxRange(event) {
    const newValue = Number(event.target.value);
    if (newValue < this.minRange) {
      this.minRange = newValue;
    }
    this.maxRange = newValue;
  }
}
