import "./div.css";

export default class Div {
  constructor(params) {
    this.params = params;
  }

  get element() {
    return this.createElement();
  }

  createElement() {
    const div = document.createElement("div");

    div.classList.add(this.params.class);

    return div;
  }
}
