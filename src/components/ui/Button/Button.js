import "./button.css";

export default class Button {
  constructor(params) {
    this.params = params;
  }

  get element() {
    return this.createElement();
  }

  createElement() {
    const btn = document.createElement("button");

    !Array.isArray(this.params.class)
      ? btn.classList.add(this.params.class)
      : btn.classList.add(...this.params.class);

    btn.innerHTML = this.params.text;
    btn.type = this.params.type;

    return btn;
  }
}
