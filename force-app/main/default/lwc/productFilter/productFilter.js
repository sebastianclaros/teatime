import { LightningElement, track, wire } from "lwc";
import getCatalogos from "@salesforce/apex/ProductController.getCatalogos";
import getCategorias from "@salesforce/apex/ProductController.getCategorias";

import { publish, MessageContext } from "lightning/messageService";
import channelProductFilter from "@salesforce/messageChannel/ProductFilter__c";

export default class ProductFilter extends LightningElement {
  @track catalogos = [];
  @track categorias = [];

  @wire(MessageContext) messageContext;

  @track catalogo;
  @track categoria;

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
      this.catalogos = data;
    }
    console.log(JSON.stringify(data));
  }

  publishEvent() {
    const payload = {
      catalogo: this.catalogo,
      categoria: this.categoria
    };
    publish(this.messageContext, channelProductFilter, payload);
  }

  handleChangeCategoria(e) {
    this.categoria = e.detail.value;
    this.publishEvent();
  }

  handleChangeCatalogo(e) {
    this.catalogo = e.detail.value;
    this.publishEvent();
  }
}
