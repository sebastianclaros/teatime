import { LightningElement, track, wire, api } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import channelProductFilter from "@salesforce/messageChannel/ProductFilter__c";

export default class ProductFilter extends LightningElement {
  @api title = "Product Filter";

  @wire(MessageContext) messageContext;
  @track data = {};
  @track terms;

  updateTerms() {
    this.terms = [];
    for (const terms of Object.values(this.data)) {
      this.terms.push(...terms);
    }
    publish(this.messageContext, channelProductFilter, this.terms);
  }

  handleIsAvailableFilter(e) {
    this.data.isAvailable = e.detail;
    this.updateTerms();
  }

  handleInStockFilter(e) {
    this.data.InStock = e.detail;
    this.updateTerms();
  }

  handlePriceFilter(e) {
    this.data.price = e.detail;
    this.updateTerms();
  }

  handleCategoryFilter(e) {
    this.data.categoria = e.detail;
    this.updateTerms();
  }

  handleRemoveFilter(e) {
    const labelToRemove = e.detail;
    this.data[labelToRemove] = undefined;
    this.updateTerms();
  }

  handleSearchFilter(e) {
    this.data.nombre = e.detail;
    this.updateTerms();
  }
}
