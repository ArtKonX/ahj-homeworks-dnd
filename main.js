/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/classes/StateApp.js
class StateApp {
  constructor() {
    this._stateTrello = {};
  }
  save() {
    localStorage.setItem("state-trello", JSON.stringify(this._stateTrello));
  }
  load(column) {
    if (localStorage.getItem("state-trello")) {
      this._stateTrello = JSON.parse(localStorage.getItem("state-trello"));
      return this._stateTrello[column];
    }
  }
  delete(column, cardId) {
    const cardIndex = this._stateTrello[column].findIndex(card => card.id == cardId);
    this._stateTrello[column].splice(cardIndex, 1);
  }
  addCard(column, card) {
    if (!this._stateTrello[column]) this._stateTrello[column] = [];
    this._stateTrello[column].push({
      id: card.id,
      title: card.title
    });
  }
  addCardInList(cardIndex, column, cardId, cardTitle) {
    this._stateTrello[column].splice(cardIndex, 0, {
      id: cardId,
      title: cardTitle
    });
  }
}
;// ./src/components/ui/Div/Div.js

class Div {
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
;// ./src/components/ui/Button/Button.js

class Button {
  constructor(params) {
    this.params = params;
  }
  get element() {
    return this.createElement();
  }
  createElement() {
    const btn = document.createElement("button");
    !Array.isArray(this.params.class) ? btn.classList.add(this.params.class) : btn.classList.add(...this.params.class);
    btn.innerHTML = this.params.text;
    btn.type = this.params.type;
    return btn;
  }
}
;// ./src/components/ui/Form/Form.js

class Form {
  constructor(params) {
    this.params = params;
  }
  get element() {
    return this.createElement();
  }
  createElement() {
    const form = document.createElement("form");
    form.classList.add(...this.params.classes);
    return form;
  }
}
;// ./src/components/ui/Textarea/Textarea.js

class Textarea {
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
;// ./src/components/ui/Heading/Heading.js

class Heading {
  constructor(params) {
    this.params = params;
  }
  get element() {
    return this.createElement();
  }
  createElement() {
    const heading = document.createElement(`h${this.getLevel()}`);
    heading.classList.add(this.params.class);
    heading.textContent = this.params.text;
    return heading;
  }
  getLevel() {
    if (this.params.level in [1, 2, 3, 4, 5, 6]) return this.params.level;
    throw new Error("Вы указали не число или число не входящее в промежутке от 1 до 6");
  }
}
;// ./src/components/trello-card/TrelloCard.js




class TrelloCard {
  constructor(parentEl, textTextarea, stateApp, columnTitle) {
    this.parentEl = parentEl;
    this.textTextarea = textTextarea;
    this.stateApp = stateApp;
    this.columnTitle = columnTitle;
    this.delCard = this.delCard.bind(this);
  }
  bindToDOM() {
    this.trelloCard = new Div({
      class: "trello-card"
    }).element;
    this.trelloCard.id = Math.round(performance.now());
    this.trelloCard.setAttribute("draggable", true);
    this.trelloCardTitle = new Heading({
      class: "trello-card-title",
      text: this.textTextarea,
      level: "3"
    }).element;
    this.btnDel = new Button({
      class: "btn-del",
      text: "X",
      type: "button"
    }).element;
    this.trelloCard.append(this.trelloCardTitle, this.btnDel);
    this.parentEl.appendChild(this.trelloCard);
    this.stateApp.addCard(this.columnTitle, {
      id: this.trelloCard.id,
      title: this.trelloCardTitle.textContent
    });
    this.stateApp.save();
    this.btnDel.addEventListener("click", this.delCard);
  }
  delCard(e) {
    const card = e.target.closest(".trello-card");
    this.stateApp.delete(this.columnTitle, card.id);
    this.stateApp.save();
    card.remove();
  }
}
;// ./src/components/trello-form-textarea/TrelloFormTextarea.js





class TrelloFormTextarea {
  constructor(parentEl, stateApp, columnTitle) {
    this.parentEl = parentEl;
    this.stateApp = stateApp;
    this.columnTitle = columnTitle;
    this.onSubmit = this.onSubmit.bind(this);
  }
  bindToDOM() {
    this.form = new Form({
      classes: ["trello-form", "trello-form_hidden"]
    }).element;
    this.textarea = new Textarea({
      class: "trello-textarea",
      placeholder: "Enter a title for this card..."
    }).element;
    this.containerBtns = new Div({
      class: "btns-container"
    }).element;
    this.btnAdd = new Button({
      class: "btn-add",
      text: "Add card",
      type: "submit"
    }).element;
    this.btnReset = new Button({
      class: "btn-reset",
      text: "X",
      type: "reset"
    }).element;
    this.containerBtns.append(this.btnAdd, this.btnReset);
    this.form.append(this.textarea, this.containerBtns);
    this.parentEl.appendChild(this.form);
    this.btnReset.addEventListener("click", this.onClick);
    this.form.addEventListener("submit", this.onSubmit);
  }
  onSubmit(e) {
    e.preventDefault();
    const trelloCard = new TrelloCard(this.parentEl.previousSibling, this.textarea.value, this.stateApp, this.columnTitle);
    trelloCard.bindToDOM();
    e.target.reset();
  }
  onClick(e) {
    const form = e.target.closest(".trello-form");
    const addBtn = form.previousSibling;
    addBtn.classList.toggle("btn-add-form_hidden");
    form.classList.toggle("trello-form_hidden");
  }
}
;// ./src/components/column-footer/ColumnFooter.js




class ColumnFooter {
  constructor(parentEl, stateApp, title) {
    this.parentEl = parentEl;
    this.stateApp = stateApp;
    this.title = title;
  }
  bindToDOM() {
    this.columnFooter = new Div({
      class: "column-footer"
    }).element;
    this.columnFooterBtnForm = new Button({
      class: "btn-add-form",
      text: "&#10010;" + `Add another card`,
      type: "button"
    }).element;
    this.columnFooter.appendChild(this.columnFooterBtnForm);
    this.form = new TrelloFormTextarea(this.columnFooter, this.stateApp, this.title).bindToDOM();
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
;// ./src/components/ui/Column/Column.js

class Column {
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
;// ./src/components/trello-cards-load/TrelloCardsLoad.js



class TrelloCardsLoad {
  constructor(parentEl, stateApp, columnTitle) {
    this.parentEl = parentEl;
    this.stateApp = stateApp;
    this.columnTitle = columnTitle;
    this.delCard = this.delCard.bind(this);
  }
  bindToDOMLoad() {
    if (this.stateApp.load(this.columnTitle)) {
      this.stateApp.load(this.columnTitle).forEach(elem => {
        this.trelloCard = new Div({
          class: "trello-card"
        }).element;
        this.trelloCard.id = elem.id;
        this.trelloCard.setAttribute("draggable", true);
        this.trelloCardTitle = new Heading({
          class: "trello-card-title",
          text: elem.title,
          level: "3"
        }).element;
        this.btnDel = new Button({
          class: "btn-del",
          text: "X",
          type: "button"
        }).element;
        this.trelloCard.append(this.trelloCardTitle, this.btnDel);
        this.parentEl.appendChild(this.trelloCard);
        this.btnDel.addEventListener("click", this.delCard);
      });
    }
  }
  delCard(e) {
    const card = e.target.closest(".trello-card");
    this.stateApp.delete(this.columnTitle, card.id);
    this.stateApp.save();
    card.remove();
  }
}
;// ./src/utils/getNextElement.js
function getNextElement(cursorPosition, currentElement) {
  const currentElementCoord = currentElement.getBoundingClientRect();
  const currentElementCenter = currentElementCoord.y;
  const nextElement = cursorPosition > currentElementCenter ? currentElement : currentElement.nextElementSibling;
  return nextElement;
}
;// ./src/components/trello-columns/TrelloColumns.js








class TrelloColumns {
  constructor(parentEl, columnsTitles) {
    this.parentEl = parentEl;
    this.columnsTitles = columnsTitles;
    this.addEventsCards = this.addEventsCards.bind(this);
  }
  bindToDOM() {
    this.stateApp = new StateApp();
    this.trelloColumnContainer = new Div({
      class: "trello-column-container"
    }).element;
    this.columnsTitles.forEach(title => {
      this.columnTitle = new Heading({
        level: 1,
        class: "trello-column-title",
        text: title
      }).element;
      this.contentColumn = new Div({
        class: "column-content"
      }).element;
      this.column = new Column({
        class: "trello-column",
        elements: [this.columnTitle, this.contentColumn]
      }).element;
      this.columnFooter = new ColumnFooter(this.column, this.stateApp, title).bindToDOM();
      this.trelloCard = new TrelloCardsLoad(this.contentColumn, this.stateApp, title).bindToDOMLoad();
      this.trelloColumnContainer.appendChild(this.column);
    });
    this.parentEl.appendChild(this.trelloColumnContainer);
    this.addEventsCards();
  }
  addEventsCards() {
    let initialClick = true;
    this.column = null;
    this.parentEl.addEventListener(`dragstart`, evt => {
      if (initialClick) {
        this.column = evt.target.closest(".trello-column").querySelector(".trello-column-title").textContent;
        initialClick = false;
      }
      evt.target.classList.add("draggable");
    });
    this.parentEl.addEventListener(`dragend`, evt => {
      evt.target.classList.remove(`draggable`);
      evt.target.classList.remove(`shadow`);
    });
    this.parentEl.addEventListener(`dragover`, evt => {
      evt.preventDefault();
      this.activeElement = this.parentEl.querySelector(`.draggable`);
      this.activeElement.style.cursor = "grabbing";
      const currentElement = evt.target;
      const isMoveable = this.activeElement !== currentElement && currentElement.classList.contains(`trello-card`);
      if (!isMoveable) {
        return;
      }
      const nextElement = getNextElement(evt.clientY, currentElement);
      if (nextElement && this.activeElement === nextElement.previousElementSibling || this.activeElement === nextElement) {
        return;
      }
      if (evt.target.closest(".trello-card")) evt.target.closest(".trello-card").classList.remove("droppable");
      const column = evt.target.closest(".column-content");
      column.insertBefore(this.activeElement, nextElement);
      this.index = [...evt.target.closest(".column-content").querySelectorAll(".trello-card")].indexOf(this.activeElement);
    });
    this.parentEl.addEventListener(`drop`, evt => {
      this.activeElement.style.cursor = "pointer";
      const activeElementId = this.activeElement.id;
      const column = evt.target.closest(".column-content");
      if (!column) return;
      const title = column.previousElementSibling;
      const cardTitle = this.activeElement.querySelector(".trello-card-title");
      this.stateApp.delete(this.column, this.activeElement.id);
      this.stateApp.addCardInList(this.index, title.textContent, activeElementId, cardTitle.textContent);
      this.stateApp.save();
    });
    this.parentEl.addEventListener("dragenter", e => {
      e;
      const card = this.parentEl.querySelector(".draggable");
      if (card) {
        card.classList.add("shadow");
      }
    });
  }
}
;// ./src/js/app.js

const columnsTitles = ["TODO", "IN PROGRESS", "DONE"];
document.addEventListener("DOMContentLoaded", () => {
  const trelloColumn = new TrelloColumns(document.querySelector("#app"), columnsTitles);
  trelloColumn.bindToDOM();
});
;// ./src/index.js


/******/ })()
;