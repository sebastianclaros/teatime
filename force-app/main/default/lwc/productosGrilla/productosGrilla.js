import { LightningElement, wire, track } from "lwc";
import getProducts from "@salesforce/apex/ProductosController.getProducts";

import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import channelProductosFiltro from "@salesforce/messageChannel/ProductosFiltro__c";

export default class ProductosGrilla extends LightningElement {
  @track productos = [];
  catalogo;
  categoria;
  isError = false;
  isLoading = true;
  subscription;

  @wire(MessageContext) messageContext;

  @wire(getProducts, { catalogId: "$catalogo", categoryId: "$categoria" })
  autoCallback({ data, error }) {
    console.log(data, error);
    this.isLoading = false;
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
        channelProductosFiltro,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  handleMessage(payload) {
    console.log(payload);
    this.catalogo = payload.catalogo;
    this.categoria = payload.categoria;
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }
}
