import { LightningElement, track, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import NAME_FIELD from "@salesforce/schema/Auto__c.Name";


export default class HolaMundo extends LightningElement {
    @api recordId;
    @api titulo;
    @track errorMessage = 'mostrar error';
    @track autoRecord;

    @wire (getRecord, { recordId: '$recordId', fields: [NAME_FIELD, 'Auto__c.Marca__c']  } )
    recordCallback( { error, data} ) {
        if ( error ) {
            console.error(error);
        }
        if ( data ) {
            this.autoRecord = data.fields;
        } 
    };

    items = [
        { value: 'naranja'},
        { value: 'verde'},
        { value: 'azul'},
        { value: 'blanco'}
    ];
    

    get indexedItems() {
        return this.items.map( (item, index) => {
            return {...item, key: index};
        })
    }
    get showTitle() {
        return this.titulo != '' && this.recordId != '';
    }

}