import { LightningElement, track, wire } from "lwc";
import getOrder from "@salesforce/apex/OrderController.getOrder";
import { publish, MessageContext } from "lightning/messageService";
import channelCart from "@salesforce/messageChannel/Cart__c";
import { CurrentPageReference, NavigationMixin } from "lightning/navigation";

export default class OrderHeader extends NavigationMixin(LightningElement) {
  recordId;
  @track order;
  @wire(MessageContext) messageContext;
  accountId;

  get hasOrder() {
    return this.order !== undefined;
  }

  @wire(CurrentPageReference)
  setCurrentPageReference(currentPageReference) {
    this.recordId = currentPageReference?.state?.c__recordId;
  }

  @wire(getOrder, { orderId: "$recordId" }) orderCallback({ data, error }) {
    if (data) {
      this.order = data;
      if (data.AccountId && this.accountId !== data.AccountId) {
        this.accountId = data.AccountId;
        publish(this.messageContext, channelCart, {
          accountId: this.accountId
        });
      }
    }
    if (error) {
      console.log(error);
      this.isError = true;
    }
  }
}
