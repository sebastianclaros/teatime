import { LightningElement, api, wire } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import channelFilters from "@salesforce/messageChannel/Filters__c";

export default class FilterSearch extends LightningElement {
  name;
  @wire(MessageContext) messageContext;
  @api field;

  handleChangeSearch(e) {
    this.name = e.detail.value;
  }

  get filter() {
    const terms =
      !this.name || this.name === ""
        ? []
        : [
            {
              field: this.field,
              value: "%" + this.name + "%",
              operator: "like"
            }
          ];
    return {
      label: "Nombre",
      name: "nombre",
      terms
    };
  }

  handleSearch() {
    publish(this.messageContext, channelFilters, this.filter);
  }
}
