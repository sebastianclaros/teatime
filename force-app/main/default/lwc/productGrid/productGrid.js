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
  filter;
  isError = false;
  isLoading = true;
  subscription;

  @wire(MessageContext) messageContext;

  @wire(getProducts, { filter: "$filter" })
  autoCallback({ data, error }) {
    this.isLoading = false;
    console.log(data, error);
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
