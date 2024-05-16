import { LightningElement, track, wire, api } from "lwc";
import getCatalogos from "@salesforce/apex/ProductController.getCatalogos";
import getCategorias from "@salesforce/apex/ProductController.getCategorias";
import { publish, MessageContext } from "lightning/messageService";
import channelFilters from "@salesforce/messageChannel/Filters__c";

export default class FilterCategory extends LightningElement {
  @track catalogos = [];
  @track categorias = [];
  @track data = {};
  @api fieldCatalog;
  @api fieldCategory;
  @wire(MessageContext) messageContext;

  get catalogo() {
    return this.data.catalogo;
  }

  @wire(getCategorias, { catalogId: "$catalogo" }) categoriasCallback({
    data,
    error
  }) {
    console.log(data, error);
    if (data) {
      const noneItem = { value: "", label: "None" };
      this.categorias = [noneItem, ...data];
    }
  }

  @wire(getCatalogos) catalogosCallback({ data }) {
    if (data) {
      const noneItem = { value: "", label: "None" };
      this.catalogos = [noneItem, ...data];
    }
  }

  get filter() {
    if (this.data.categoria) {
      return [
        {
          name: "categoria",
          terms: [
            {
              field: this.fieldCategory,
              value: this.data.categoria,
              operator: "="
            }
          ]
        }
      ];
    }
    if (this.data.catalogo) {
      return [
        {
          name: "catalogo",
          terms: [
            {
              field: this.fieldCatalog,
              value: this.data.catalogo,
              operator: "="
            }
          ]
        }
      ];
    }
    return [];
  }

  triggerEvent() {
    publish(this.messageContext, channelFilters, this.filter);
  }

  handleChangeCategoria(e) {
    this.data.categoria = e.detail.value;
    this.triggerEvent();
  }

  handleChangeCatalogo(e) {
    this.data.catalogo = e.detail.value;
    this.triggerEvent();
  }
}
