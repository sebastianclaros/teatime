import { LightningElement, track, api } from 'lwc';

export default class HolaMundo extends LightningElement {
    @api recordId;
    @api titulo;
    @track test;


}