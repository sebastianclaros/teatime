import { LightningElement, track, wire } from "lwc";
import getFamilias from "@salesforce/apex/AutoController.getFamilias";
/* Alternativa usando wire standard
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import AUTO_OBJECT from "@salesforce/schema/Product2";
import Familia_FIELD from '@salesforce/schema/Product2.Family';
*/

import { publish, MessageContext } from "lightning/messageService";
import filtroAutos from "@salesforce/messageChannel/FiltroAutos__c";

export default class FiltroAutos extends LightningElement {
  @track familias;

  @wire(MessageContext) messageContext;

  @wire(getFamilias) autoCallback({ data }) {
    if (data) {
      this.familias = data;
    }
    console.log(JSON.stringify(data));
  }

  handleChangeFamilia(e) {
    const payload = { Familia: e.detail.value };

    publish(this.messageContext, filtroAutos, payload);
  }

  /* Alternativa usando wire standard
    recordTypeId;
    
    @wire(getObjectInfo, { objectApiName: AUTO_OBJECT })
    results({ error, data }) {
      if (data) {
        this.recordTypeId = data.defaultRecordTypeId;
      }
    }
  

    @wire(getPicklistValues, { recordTypeId: "$recordTypeId", fieldApiName: Familia_FIELD })
    picklistResults({ error, data }) {
    console.log( error, data);
      if (data) {
        this.Familias = data.values;

      } else if (error) {
      }
    }
*/
}
