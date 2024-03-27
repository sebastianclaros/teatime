import { LightningElement, wire, track } from "lwc";
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import channelCart from "@salesforce/messageChannel/Cart__c";
import { getRecord } from "lightning/uiRecordApi";
const FIELDS = ["Account.Name"];

export default class OrderAccount extends LightningElement {
  @wire(MessageContext) messageContext;
  accountId;
  @track account;

  get hasAccount() {
    return this.account !== undefined;
  }

  @wire(getRecord, { recordId: "$accountId", fields: FIELDS })
  accountRecord({ error, data }) {
    if (error) {
      console.log("Error Occered in @Wire-->" + error.body.message);
    } else if (data) {
      this.account = data.fields;
    }
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        channelCart,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  handleMessage(payload) {
    if (payload.accountId) {
      this.accountId = payload.accountId;
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
