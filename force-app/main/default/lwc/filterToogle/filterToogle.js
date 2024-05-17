import { LightningElement, api, wire } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import channelFilters from "@salesforce/messageChannel/Filters__c";

export default class FilterToogle extends LightningElement {
  @api field;
  @api label;
  @api name;
  isChecked;
  @wire(MessageContext) messageContext;

  handleToogle(e) {
    this.isChecked = e.detail.checked;
  }

  get filter() {
    return [
      {
        label: this.label,
        name: this.name,
        terms: [
          {
            field: this.field,
            value: this.isChecked,
            operator: "="
          }
        ]
      }
    ];
  }

  handleSearch() {
    publish(this.messageContext, channelFilters, this.filter);
  }
}
