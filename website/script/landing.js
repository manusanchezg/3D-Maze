const startGame = document.getElementById("startGame");
const floors = document.getElementById("numOfFloors");
const size = document.getElementById("sizeOfMaze");
const username = document.getElementById("userName");
const checkStorageBtn = document.getElementById("checkLocalStortage");
const modal = document.getElementById("modal");
const keepPlaying = document.getElementById("keepPlaying");
const mazeTypeSelect = document.getElementById("mazeType");
let maze;

floors.addEventListener("input", (e) => {
  checkValidity(e);
});
size.addEventListener("input", (e) => {
  checkValidity(e);
});

function checkValidity(e) {
  const regex = /[0-9]+/;
  if (
    !regex.test(Number(e.target.value)) ||
    Number(e.target.value) <= 0 ||
    e.target.value === ""
  ) {
    alert("The size and the floor should be numbers greater than 0");
  }
}

checkStorageBtn.addEventListener("click", () => {
  if (!localStorage.getItem(username.value)) {
    console.log(mazeTypeSelect.value);
    location = `pages/game.html?floors=${floors.value}&size=${size.value}&username=${username.value}&mazeType=${mazeTypeSelect.value}`;
  } else {
    modal.style.display = "inherit";
    maze = localStorage.getItem(username.value);
  }
});

startGame.addEventListener("click", () => {
  location = `pages/game.html?floors=${floors.value}&size=${size.value}&username=${username.value}&mazeType=${mazeTypeSelect.value}`;
});

keepPlaying.addEventListener("click", () => {
  JSON.parse(maze);
  location = `pages/game.html?floors=${maze.floors}&size=${maze.size}&username=${username.value}`;
});
