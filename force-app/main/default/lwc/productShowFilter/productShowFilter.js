import { LightningElement, api, track } from 'lwc';

export default class ProductShowFilter extends LightningElement {
    @api filter = [
        {
            "label":"pepito",
            "field":"123",
            "value":"123" 
        }
    ];

    @track filtervalues;
    /*
    filter =>
    [
        {
        "label":"",
        "field":"",
        "value":"",       
        "operator":     // opcional
        },
        {},
        {}
    ]
    */

    // cuando se presiona la cruz en alguno de los elementos, emitir evento "change" con los valores
    // actualizados del filtro

    connectedCallback(){
        this.filtervalues = this.filter;
        console.log('connectedCallback del componente productShowFilter'  );
        console.log('this.filtervalues --> ', this.filtervalues);
    }

    handleRemove(evt){
        console.log('se removió el elemento: ', evt.target.label);

        // eliminar el elemento correspondiente en "filter"
        // emitir el evento "change" con los parámetros de filtro actualizados
        
    }


}