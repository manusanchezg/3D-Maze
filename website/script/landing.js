const startGame = document.getElementById("startGame")
const floors = document.getElementById("numOfFloors")
const size = document.getElementById("sizeOfMaze")

floors.addEventListener("input", () => {
    
})


startGame.addEventListener("click", () => {
    location = `../index.html?floors=${floors.value}&size=${size.value}`
})