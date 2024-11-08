import "./column.css";

export default class Column {
  constructor(params) {
    this.params = params;
  }

  get element() {
    return this.createElement();
  }

  createElement() {
    const column = document.createElement("section");

    column.classList.add(this.params.class);
    column.append(...this.params.elements);

    return column;
  }
}
