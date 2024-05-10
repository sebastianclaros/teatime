import { LightningElement, track, wire, api} from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import channelProductFilter from "@salesforce/messageChannel/ProductFilter__c";

export default class ProductFilter extends LightningElement {

  @api title = 'Product Filter';  
  
  @wire(MessageContext) messageContext;  
  @track data = {};

  get terms() {
    const payload = [];
    for (const terms of Object.values(this.data) ) {
      payload.push(...terms);
    }
    return payload;
  }

  publishEvent() {
    publish(this.messageContext, channelProductFilter, this.terms );
  }

  handleSearchFilter(e) {
    this.data.name = e.detail;
    this.publishEvent();
  }
}
