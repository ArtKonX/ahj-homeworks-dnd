export default class StateApp {
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
    const cardIndex = this._stateTrello[column].findIndex(
      (card) => card.id == cardId,
    );
    this._stateTrello[column].splice(cardIndex, 1);
  }

  addCard(column, card) {
    if (!this._stateTrello[column]) this._stateTrello[column] = [];

    this._stateTrello[column].push({ id: card.id, title: card.title });
  }

  addCardInList(cardIndex, column, cardId, cardTitle) {
    this._stateTrello[column].splice(cardIndex, 0, {
      id: cardId,
      title: cardTitle,
    });
  }
}
