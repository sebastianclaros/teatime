import { LightningElement } from 'lwc';

export default class FilterSearch extends LightningElement {
    name;

    handleChangeSearch(e) {
        this.name = e.detail.value;
    }

    get filter() {
        return [ {"label": "nombre","field": "name", "value": '%' + this.name + '%', "operator": "like" }] ;
    }

    handleSearch() {
        this.dispatchEvent(new CustomEvent('filter', { detail: this.filter }));
    }
}    
