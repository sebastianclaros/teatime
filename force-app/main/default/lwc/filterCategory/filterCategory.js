import { LightningElement, track, wire } from "lwc";
import getCatalogos from "@salesforce/apex/ProductController.getCatalogos";
import getCategorias from "@salesforce/apex/ProductController.getCategorias";

export default class FilterCategory extends LightningElement {
  @track catalogos = [];
  @track categorias = [];
  @track data = {};

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
      console.log(data);
      const noneItem = { value: "", label: "None" };
      this.catalogos = [noneItem, ...data];
    }
  }

  get filter() {
    if (this.data.categoria) {
      return [
        {
          label: "categoria",
          field: "ProductCategoryProducts.ProductCategoryId",
          value: this.data.categoria,
          operator: "="
        }
      ];
    }
    if (this.data.catalogo) {
      return [
        {
          label: "categoria",
          field: "ProductCategoryProducts.ProductCategory.CatalogId",
          value: this.data.catalogo,
          operator: "="
        }
      ];
    }
    return [];
  }

  triggerEvent() {
    this.dispatchEvent(new CustomEvent("filter", { detail: this.filter }));
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
