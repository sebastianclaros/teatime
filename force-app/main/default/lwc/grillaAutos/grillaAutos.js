import { LightningElement, wire, track , api} from 'lwc';
import getAutos from '@salesforce/apex/AutoController.getAutos';
import saveAuto from '@salesforce/apex/AutoController.saveAuto2';
import {createRecord} from 'lightning/uiRecordApi';

export default class GrillaAutos extends LightningElement {
    @track autos = [];
    @api marca = 'VW';
    random = '';
    isError = false;
    isLoading = true;

    @wire (getAutos, { marca: '$marca', random: '$random' } ) autoCallback({data,error}) {
        this.isLoading = false;
        if( data) {
            this.autos = data.map( (auto, index) => {
                return { key: `auto-key-${index}`, ...auto};
            });
        }
        if ( error ) {
            this.isError = true;
        }
    }
    
    async save() {
        try {
            const result = await saveAuto({ Name: 'Test' + Date.now() , marca: 'VW' });
            this.random = Math.random();
        } catch (e) {
            console.log(e);
        }  
    }
}