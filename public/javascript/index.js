import { socket } from "./socket.js";
import startTicTacToeGame from "./ticTacToe";

socket.on("room", (data) => {
  if (data.action === "joined room") {
    if (data.pickedGame === "tic-tac-toe") {
      startTicTacToeGame();
    }
    if (data.pickedGame === "pong") {
      //startPongGame();
    }
  }
});

const joinRoom = (pickedGame) => {
  // display loading...
  socket.emit("room", {
    action: "join room",
    pickedGame: pickedGame,
  });
};

const ticTacToeBtn = document.querySelector(".ticTacToeBtn");
const pongBtn = document.querySelector(".pongBtn");

ticTacToeBtn.addEventListener("click", () => {
  joinRoom("tic-tac-toe");
});
pongBtn.addEventListener("click", () => {
  joinRoom("pong");
});
