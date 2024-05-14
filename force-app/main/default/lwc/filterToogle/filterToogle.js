import { LightningElement, api } from 'lwc';

export default class FilterToogle extends LightningElement {
    
    @api field;
    @api label;

    isChecked;

    handleToogle(e) {
        this.isChecked = e.detail.checked;
    }

    get filter() {
        return [ {"label": this.label, "field": this.field, "value": this.isChecked , "operator": "=" }] ;
    }

    handleSearch() {
        this.dispatchEvent(new CustomEvent('filter', { detail: this.filter }));
    }
    
}