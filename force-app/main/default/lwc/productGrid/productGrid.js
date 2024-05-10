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
  isError = false;
  isLoading = false;
  subscription;

  @wire(MessageContext) messageContext;

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

  async handleMessage(payload) {
    try {
      const data = await getProducts({ terms: payload} );
      this.isLoading = false;
      this.productos = data.map((producto, index) => {
        return { key: `auto-key-${index}`, ...producto };
      });
    } catch (error) {
      console.log(error);
      this.isError = true;
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