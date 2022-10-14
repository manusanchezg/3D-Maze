const startGame = document.getElementById("startGame");
const floors = document.getElementById("numOfFloors");
const size = document.getElementById("sizeOfMaze");

floors.addEventListener("input", (e) => {
  checkValidity(e);
});
size.addEventListener("input", (e) => {
  console.log(e.target.value, typeof e.target.value);
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

startGame.addEventListener("click", () => {
  location = `pages/game.html?floors=${floors.value}&size=${size.value}`;
});
