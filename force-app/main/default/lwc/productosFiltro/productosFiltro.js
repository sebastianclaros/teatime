import { LightningElement, track, wire } from "lwc";
import getCatalogos from "@salesforce/apex/ProductosController.getCatalogos";
import getCategorias from "@salesforce/apex/ProductosController.getCategorias";

import { publish, MessageContext } from "lightning/messageService";
import channelProductosFiltro from "@salesforce/messageChannel/ProductosFiltro__c";

export default class ProductosFiltro extends LightningElement {
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
    publish(this.messageContext, channelProductosFiltro, payload);
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
