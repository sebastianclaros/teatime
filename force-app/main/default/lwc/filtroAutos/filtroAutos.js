import { LightningElement, track , wire} from 'lwc';
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import AUTO_OBJECT from "@salesforce/schema/Auto__c";
import MARCA_FIELD from '@salesforce/schema/Auto__c.Marca__c';


export default class FiltroAutos extends LightningElement {

    @track marcas;
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

    handleChangeMarca(e) {
        console.log(e);
    }
}