import { LightningElement, track, wire } from "lwc";
import getMarcas from "@salesforce/apex/AutoController.getMarcas";
/* Alternativa usando wire standard
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import AUTO_OBJECT from "@salesforce/schema/Auto__c";
import MARCA_FIELD from '@salesforce/schema/Auto__c.Marca__c';
*/

import { publish, MessageContext } from "lightning/messageService";
import filtroAutos from "@salesforce/messageChannel/FiltroAutos__c";

export default class FiltroAutos extends LightningElement {
  @track marcas;

  @wire(MessageContext) messageContext;

  @wire(getMarcas) autoCallback({ data }) {
    if (data) {
      this.marcas = data;
    }
    console.log(JSON.stringify(data));
  }

  handleChangeMarca(e) {
    const payload = { marca: e.detail.value };

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
  

    @wire(getPicklistValues, { recordTypeId: "$recordTypeId", fieldApiName: MARCA_FIELD })
    picklistResults({ error, data }) {
    console.log( error, data);
      if (data) {
        this.marcas = data.values;

      } else if (error) {
      }
    }
*/
}
