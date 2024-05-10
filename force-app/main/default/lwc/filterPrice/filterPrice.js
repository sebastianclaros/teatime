import { LightningElement, track } from 'lwc';

export default class FilterPrice extends LightningElement {
    @track minRange = 0;
    @track maxRange = 10000;

    triggerEvent() {
        this.dispatchEvent(new CustomEvent('filter', { detail: this.filter }));

    }

    get filter() {  
        return [ 
            {"field": "price", "value": this.minRange, "operator": ">=" },
            {"field": "price", "value": this.maxRange, "operator": "<=" }
        ] ;
    }

    
    handleMinRange(event) {
      const newValue = Number(event.target.value);
      if ( newValue  >= this.maxRange) { 
        this.maxRange = newValue;
      } 
      this.minRange = newValue;
      this.triggerEvent();
    }    
    
    handleMaxRange(event) {
      const newValue = Number(event.target.value);
      if ( newValue < this.minRange) {
        this.minRange = newValue;
    
        // return false;
      }
      this.maxRange = newValue;
      this.triggerEvent();
    }

}