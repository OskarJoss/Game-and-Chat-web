import { socket } from "./socket.js";

const startTicTacToeGame = () => {
  socket.emit("tic-tac-toe", {
    action: "start game",
  });

  socket.on("tic-tac-toe", (data) => {
    if (data.action === "update gameState") {
      //   setGameState(data.gameState);
      console.log(data);
    }
  });
};

export default startTicTacToeGame;
