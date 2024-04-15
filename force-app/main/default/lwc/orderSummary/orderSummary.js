import { LightningElement, track, wire } from "lwc";
import ORDER from "@salesforce/schema/Order";
import { getObjectInfo } from "lightning/uiObjectInfoApi";

export default class OrderSummary extends LightningElement {
  @track labels = {};

  @wire(getObjectInfo, { objectApiName: ORDER })
  orderGetInfo({ data }) {
    if (data) {
      //this.labels.orderNumber = data.fields.OrderNumber?.label;
      this.labels.orderNumber = data.fields.OrderNumber?.inlineHelp;
    }
  }
}
