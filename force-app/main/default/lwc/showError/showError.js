import { LightningElement, api } from "lwc";

export default class ShowError extends LightningElement {
  severity = ["SIN TITULO"];
  @api message = "test";

  constructor() {
    super();
    console.log("constructor", this.severity);
  }

  renderedCallback() {
    console.log("me rerenderize", this.severity);
  }

  connectedCallback() {
    console.log("me connecte al dom", this.severity);
  }

  get firstSeverity() {
    return this.severity[0];
  }

  changeError() {
    this.severity[0] = "ERROR";
    console.log("cambie el severity", this.severity);
  }
}
