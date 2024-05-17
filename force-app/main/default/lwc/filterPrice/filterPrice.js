import { LightningElement, track, api, wire } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import channelFilters from "@salesforce/messageChannel/Filters__c";

export default class FilterPrice extends LightningElement {
  @track minRange = 0;
  @track maxRange = 10000;
  @api pricebookId;
  @api field;
  @wire(MessageContext) messageContext;

  triggerEvent() {
    publish(this.messageContext, channelFilters, this.filter);
  }

  get filter() {
    return {
      label: `Precio: ${this.minRange} ~ ${this.maxRange}`,
      name: "precio",
      terms: [
        {
          field: this.field,
          value: this.minRange,
          operator: ">="
        },
        {
          field: this.field,
          value: this.maxRange,
          operator: "<="
        }
      ]
    };
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
