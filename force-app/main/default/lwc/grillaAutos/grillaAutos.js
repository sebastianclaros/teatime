import { LightningElement, wire, track , api} from 'lwc';
import getAutos from '@salesforce/apex/AutoController.getAutos';

export default class GrillaAutos extends LightningElement {
    @track autos = [];
    @api marca = 'VW';
    isError = false;
    isLoading = true;

    @wire (getAutos, { marca: '$marca'} ) autoCallback({data,error}) {
        console.log(error, data);
        setTimeout( () => this.isLoading = false, 500 );
        if( data) {
            this.autos = data;
        }
        if ( error ) {
            this.isError = true;
        }
    }

}