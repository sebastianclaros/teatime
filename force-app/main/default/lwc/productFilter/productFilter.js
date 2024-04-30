import { LightningElement, track, wire, api} from "lwc";
import getCatalogos from "@salesforce/apex/ProductController.getCatalogos";
import getCategorias from "@salesforce/apex/ProductController.getCategorias";

import { publish, MessageContext } from "lightning/messageService";
import channelProductFilter from "@salesforce/messageChannel/ProductFilter__c";

export default class ProductFilter extends LightningElement {

  @api title = 'Product Filter';
  @track catalogos = [];
  @track categorias = [];

  @wire(MessageContext) messageContext;

  @track filter = {};
  @track minRange = 0;
  @track maxRange = 10000;
  name = '';

  get catalogo() {
    return this.filter.catalogo;
  }

  handleMinRange(event) {
    const newValue = Number(event.target.value);
    if ( newValue  >= this.maxRange) { 
      this.maxRange = newValue;
    } 
    this.minRange = newValue;
    this.filter.price = {
      from: this.minRange, 
      to: this.maxRange
    }
    this.publishEvent();
  }

  handleMaxRange(event) {
    const newValue = Number(event.target.value);
    if ( newValue < this.minRange) {
      this.minRange = newValue;

      // return false;
    }
    this.maxRange = newValue;
    this.filter.price = {
      from: this.minRange, 
      to: this.maxRange
    }
    this.publishEvent();
  }



  @wire(getCategorias, { catalogId: "$catalogo" }) categoriasCallback({
    data
  }) {
    if (data) {
      const noneItem = { value: "", label: "None" };
      this.categorias = [noneItem, ...data];
    }
    console.log(JSON.stringify(this.categorias));
  }

  @wire(getCatalogos) catalogosCallback({ data }) {
    if (data) {
      const noneItem = { value: "", label: "None" };
      this.catalogos = [noneItem, ...data];
    }
    console.log(JSON.stringify(data));
  }

  publishEvent() {
    console.log(this.filter);
    publish(this.messageContext, channelProductFilter, this.filter);
  }

  handleInStock(e) {
    console.log(e.detail);
    this.filter.inStock = e.detail.checked;
    this.publishEvent();
  }
  
  handleAvailable(e) {
    this.filter.isAvailable = e.detail.checked;
    this.publishEvent();
  }

  handleChangeSearch(e) {
    this.name = e.detail.value;
  }

  handleSearch(e) {
    this.filter.name = this.name;
    this.publishEvent();
  }

  handleChangeCategoria(e) {
    this.filter.categoria = e.detail.value;
    this.publishEvent();
  }

  handleChangeCatalogo(e) {
    this.filter.catalogo = e.detail.value;
    this.publishEvent();
  }
}
