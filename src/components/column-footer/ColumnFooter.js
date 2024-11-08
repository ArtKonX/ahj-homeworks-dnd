import "./columnFooter.css";

import Div from "../ui/Div/Div";
import Button from "../ui/Button/Button";
import TrelloFormTextarea from "../trello-form-textarea/TrelloFormTextarea";

export default class ColumnFooter {
  constructor(parentEl, stateApp, title) {
    this.parentEl = parentEl;
    this.stateApp = stateApp;
    this.title = title;
  }

  bindToDOM() {
    this.columnFooter = new Div({ class: "column-footer" }).element;

    this.columnFooterBtnForm = new Button({
      class: "btn-add-form",
      text: "&#10010;" + `Add another card`,
      type: "button",
    }).element;
    this.columnFooter.appendChild(this.columnFooterBtnForm);

    this.form = new TrelloFormTextarea(
      this.columnFooter,
      this.stateApp,
      this.title,
    ).bindToDOM();

    this.parentEl.appendChild(this.columnFooter);
    this.columnFooterBtnForm.addEventListener("click", this.openForm);
  }

  openForm(e) {
    const addBtn = e.target;
    const form = e.target.nextElementSibling;

    addBtn.classList.toggle("btn-add-form_hidden");
    form.classList.toggle("trello-form_hidden");
  }
}
