import "./trelloColums.css";

import StateApp from "../../classes/StateApp";

import ColumnFooter from "../column-footer/ColumnFooter";
import Column from "../ui/Column/Column";
import Div from "../ui/Div/Div";
import Heading from "../ui/Heading/Heading";
import TrelloCardsLoad from "../trello-cards-load/TrelloCardsLoad";

import getNextElement from "../../utils/getNextElement";

export default class TrelloColumns {
  constructor(parentEl, columnsTitles) {
    this.parentEl = parentEl;
    this.columnsTitles = columnsTitles;

    this.addEventsCards = this.addEventsCards.bind(this);
  }

  bindToDOM() {
    this.stateApp = new StateApp();

    this.trelloColumnContainer = new Div({
      class: "trello-column-container",
    }).element;

    this.columnsTitles.forEach((title) => {
      this.columnTitle = new Heading({
        level: 1,
        class: "trello-column-title",
        text: title,
      }).element;
      this.contentColumn = new Div({ class: "column-content" }).element;
      this.column = new Column({
        class: "trello-column",
        elements: [this.columnTitle, this.contentColumn],
      }).element;
      this.columnFooter = new ColumnFooter(
        this.column,
        this.stateApp,
        title,
      ).bindToDOM();
      this.trelloCard = new TrelloCardsLoad(
        this.contentColumn,
        this.stateApp,
        title,
      ).bindToDOMLoad();

      this.trelloColumnContainer.appendChild(this.column);
    });

    this.parentEl.appendChild(this.trelloColumnContainer);

    this.addEventsCards();
  }

  addEventsCards() {
    let initialClick = true;

    this.column = null;

    this.parentEl.addEventListener(`dragstart`, (evt) => {
      if (initialClick) {
        this.column = evt.target
          .closest(".trello-column")
          .querySelector(".trello-column-title").textContent;
        initialClick = false;
      }
      evt.target.classList.add("draggable");
    });

    this.parentEl.addEventListener(`dragend`, (evt) => {
      evt.target.classList.remove(`draggable`);
      evt.target.classList.remove(`shadow`);
    });

    this.parentEl.addEventListener(`dragover`, (evt) => {
      evt.preventDefault();

      this.activeElement = this.parentEl.querySelector(`.draggable`);
      const currentElement = evt.target;

      const nextElement = getNextElement(evt.clientY, currentElement);

      if (
        (nextElement &&
          this.activeElement === nextElement.previousElementSibling) ||
        this.activeElement === nextElement
      ) {
        return;
      }

      if (evt.target.closest(".trello-card"))
        evt.target.closest(".trello-card").classList.remove("droppable");

      const column = evt.target.closest(".column-content");

      if (!column?.innerHTML) {
        if (column) {
          column.appendChild(this.activeElement);
        }
      }

      if (
        this.activeElement !== currentElement &&
        currentElement.classList.contains(`trello-card`)
      ) {
        evt.target
          .closest(".column-content")
          .insertBefore(this.activeElement, nextElement);
      }

      if (
        evt?.target &&
        evt.target.closest(".column-content") &&
        evt.target.closest(".column-content").querySelectorAll(".trello-card")
      ) {
        const cards = evt.target
          .closest(".column-content")
          .querySelectorAll(".trello-card");
        this.index = Array.from(cards).indexOf(this.activeElement);
      }
    });

    this.parentEl.addEventListener(`drop`, (evt) => {
      this.activeElement.style.cursor = "pointer";

      const column = evt.target.closest(".column-content");

      if (!column) return;

      const activeElementId = this.activeElement.id;
      const title = column.previousElementSibling;
      const cardTitle = this.activeElement.querySelector(".trello-card-title");
      this.stateApp.delete(this.column, this.activeElement.id);

      this.stateApp.addCardInList(
        this.index,
        title.textContent,
        activeElementId,
        cardTitle.textContent,
      );

      this.stateApp.save();
    });

    this.parentEl.addEventListener("dragenter", (e) => {
      e;
      const card = this.parentEl.querySelector(".draggable");
      const column = e.target.closest(".column-content");

      if (column) {
        card.classList.add("shadow");
      }
    });
  }
}
