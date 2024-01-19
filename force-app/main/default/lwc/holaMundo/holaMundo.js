import { LightningElement, track, api, wire } from 'lwc';
import sumaMethod from '@salesforce/apex/holaMundoController.suma';


export default class HolaMundo extends LightningElement {
    @api recordId;
    @api titulo;
    @track errorMessage = 'mostrar error';
    @track autoRecord;

    numeroA = 3;
    numeroB = 2;
    @track resultado;

    inputHandler(event) {
        this.numeroA = event.target.value;
    }

    inputHandlerB(event) {
        this.numeroB = event.target.value;
    }

    @wire (sumaMethod, { numeroA: '$numeroA',  numeroB: '$numeroB'   } )
    sumaCallback( {data, error} ) {
        console.log(data);
        this.resultado = data;
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