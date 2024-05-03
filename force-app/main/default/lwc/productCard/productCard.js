import { LightningElement, api } from 'lwc';


export default class CardItem extends LightningElement {


@api record;

connectedCallback() {
console.log("esto es record----->", this.record);
}

}