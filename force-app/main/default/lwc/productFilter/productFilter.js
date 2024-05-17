import { LightningElement, track, wire, api } from "lwc";
import {
  publish,
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import channelProductFilter from "@salesforce/messageChannel/ProductFilter__c";
import channelFilters from "@salesforce/messageChannel/Filters__c";

export default class ProductFilter extends LightningElement {
  @api title = "Product Filter";

  @wire(MessageContext) messageContext;
  @track data = {};
  subscription;
  @track dataValues;

  updateTerms() {
    this.dataValues = Object.values(this.data);
    const terms = [];
    for (const filter of this.dataValues) {
      terms.push(...filter.terms);
    }
    publish(this.messageContext, channelProductFilter, terms);
  }

  handleFilter(filter) {
    const name = filter.name || filter.label;
    this.data[name] = filter;
    this.updateTerms();
  }

  handleRemove(e) {
    const name = e.target.dataset.name;
    delete this.data[name];
    // TODO: Dispara para que el componente se limpie
    this.updateTerms();
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        channelFilters,
        (terms) => this.handleFilter(terms),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }
}
