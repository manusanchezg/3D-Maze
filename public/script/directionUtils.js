export function getDirectionMap(currentPlayer) {
  return new Map([
    ["floorUpButton", [0, currentPlayer.floor + 1, currentPlayer.row, currentPlayer.col]],
    ["floorDownButton", [1, currentPlayer.floor - 1, currentPlayer.row, currentPlayer.col]],
    ["forwardButton", [2, currentPlayer.floor, currentPlayer.row - 1, currentPlayer.col]],
    ["rightButton", [3, currentPlayer.floor, currentPlayer.row, currentPlayer.col + 1]],
    ["backwardButton", [4, currentPlayer.floor, currentPlayer.row + 1, currentPlayer.col]],
    ["leftButton", [5, currentPlayer.floor, currentPlayer.row, currentPlayer.col - 1]],
  ]);
}

export function keyToDirectionId(e) {
  const key = (e.key || '').toLowerCase();
  switch (key) {
    case 'arrowup':
    case 'w':
      return 'forwardButton';
    case 'arrowdown':
    case 's':
      return 'backwardButton';
    case 'arrowleft':
    case 'a':
      return 'leftButton';
    case 'arrowright':
    case 'd':
      return 'rightButton';
    case 'pageup':
    case 'r':
      return 'floorUpButton';
    case 'pagedown':
    case 'f':
      return 'floorDownButton';
    default:
      return null;
  }
}
