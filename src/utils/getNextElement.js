export default function getNextElement(cursorPosition, currentElement) {
  const currentElementCoord = currentElement.getBoundingClientRect();

  const currentElementCenter = currentElementCoord.y;

  const nextElement =
    cursorPosition > currentElementCenter
      ? currentElement
      : currentElement.nextElementSibling;

  return nextElement;
}
