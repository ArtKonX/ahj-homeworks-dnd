import TrelloColumns from "../components/trello-columns/TrelloColumns";

const columnsTitles = ["TODO", "IN PROGRESS", "DONE"];

document.addEventListener("DOMContentLoaded", () => {
  const trelloColumn = new TrelloColumns(
    document.querySelector("#app"),
    columnsTitles,
  );
  trelloColumn.bindToDOM();
});
