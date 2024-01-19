import { LightningElement, wire, track } from 'lwc';
import getAutos from '@salesforce/apex/AutoController.getAutos';

export default class GrillaAutos extends LightningElement {
    @track autos = [];

    @wire (getAutos) autoCallback({data,error}) {
        console.log(error, data);
        if( data) {
            this.autos = data;
        }
    }

}