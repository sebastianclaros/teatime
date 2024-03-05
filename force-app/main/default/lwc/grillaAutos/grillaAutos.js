import { LightningElement, wire, track } from "lwc";
import getAutos from "@salesforce/apex/AutoController.getAutos";
import saveAuto from "@salesforce/apex/AutoController.saveAuto2";

import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import filtroAutos from "@salesforce/messageChannel/FiltroAutos__c";

export default class GrillaAutos extends LightningElement {
  @track autos = [];
  marca;
  random = "";
  isError = false;
  isLoading = true;
  subscription;

  @wire(MessageContext) messageContext;

  @wire(getAutos, { marca: "$marca", random: "$random" }) autoCallback({
    data,
    error
  }) {
    this.isLoading = false;
    if (data) {
      this.autos = data.map((auto, index) => {
        return { key: `auto-key-${index}`, ...auto };
      });
    }
    if (error) {
      this.isError = true;
    }
  }

  // Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        filtroAutos,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  handleMessage(payload) {
    console.log(payload);
    this.marca = payload.marca;
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  async save() {
    try {
      await saveAuto({ Name: "Test" + Date.now(), marca: "VW" });
      this.random = Math.random();
    } catch (e) {
      console.log(e);
    }
  }
}
