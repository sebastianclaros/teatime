import { LightningElement, wire, track } from "lwc";
import getProducts from "@salesforce/apex/ProductController.getProducts";

import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import channelProductFilter from "@salesforce/messageChannel/ProductFilter__c";

export default class ProductGrid extends LightningElement {
  @track productos = [];
  filter = { "field": "name", "value": "sur", "operator": "="};
  isError = false;
  isLoading = true;
  subscription;

  get filterString() {
    return JSON.stringify(this.filter);
  }

  @wire(MessageContext) messageContext;

  @wire(getProducts, { terms: "$filter", termString: "$filterString" })
  autoCallback({ data, error }) {    
    this.isLoading = false;
    this.isError = false;
    console.log(this.filter, data, error);
    if (data) {
      this.productos = data.map((producto, index) => {
        return { key: `auto-key-${index}`, ...producto };
      });
    }
    if (error) {
      console.log(error);
      this.isError = true;
    }
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        channelProductFilter,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  handleMessage(payload) {
    this.filter = payload;
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }
}