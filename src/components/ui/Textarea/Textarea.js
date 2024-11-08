import "./textarea.css";

export default class Textarea {
  constructor(params) {
    this.params = params;
  }

  get element() {
    return this.createElement();
  }

  createElement() {
    const textarea = document.createElement("textarea");

    textarea.classList.add(this.params.class);
    textarea.placeholder = this.params.placeholder;

    return textarea;
  }
}
