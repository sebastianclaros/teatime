import { LightningElement, wire } from "lwc";
import ORDER from "@salesforce/schema/Order";
import { getObjectInfo } from "lightning/uiObjectInfoApi";

export default class OrderSummary extends LightningElement {
  labels = {};

  @wire(getObjectInfo, { objectApiName: ORDER })
  oppInfo({ data }) {
    if (data) {
      this.labels.orderNumber = data.fields.ordeNumber.label;
    }
  }
}
