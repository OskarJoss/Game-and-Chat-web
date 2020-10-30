const ticTacToeContainer = document.querySelector(".ticTacToeContainer");
const board = document.querySelector(".board");
const startBtn = document.querySelector(".startBtn");
const loadingText = document.querySelector(".loadingText");
const turnText = document.querySelector(".turnText");
const chatContainer = document.querySelector(".chatContainer");

let gameState;

const drawBoard = (gameState) => {
  let rowNumber = 0;
  gameState.board.forEach((row) => {
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");
    let squareNumber = 0;
    row.forEach((square) => {
      const squareElement = document.createElement("div");
      squareElement.classList.add("square");
      squareElement.dataset.row = rowNumber;
      squareElement.dataset.square = squareNumber;
      rowElement.appendChild(squareElement);
      squareNumber++;
    });
    board.appendChild(rowElement);
    rowNumber++;
  });
};

const updateBoard = (gameState) => {
  turnText.textContent =
    gameState.turn === socket.id ? "Your turn" : "Opponents turn";

  let rowNumber = 0;
  gameState.board.forEach((row) => {
    let squareNumber = 0;
    row.forEach((square) => {
      const squareElement = document.querySelector(
        `[data-row='${rowNumber}'][data-square='${squareNumber}']`
      );
      let symbol = "";
      switch (square) {
        case 0:
          symbol = "";
          break;
        case 1:
          symbol = "X";
          break;
        case 2:
          symbol = "O";
          break;
      }
      squareElement.textContent = symbol;
      squareNumber++;
    });
    rowNumber++;
  });

  if (gameState.winner) {
    if (gameState.winner === "draw") {
      turnText.textContent = "Draw";
    } else {
      turnText.textContent =
        gameState.winner === socket.id ? "You win!" : "You loose!";
    }
  }
};

const placeSymbol = (e) => {
  if (gameState.turn === socket.id) {
    const row = parseInt(e.target.dataset.row);
    const square = parseInt(e.target.dataset.square);

    socket.emit("tic-tac-toe", {
      action: "place symbol",
      position: {
        row: row,
        square: square,
      },
    });
  }
};

socket.on("room", (data) => {
  if (data.action === "joined room") {
    socket.emit("tic-tac-toe", {
      action: "start game",
    });
  }
});

socket.on("tic-tac-toe", (data) => {
  if (data.action === "initial gameState") {
    loadingText.classList.add("hidden");
    ticTacToeContainer.classList.remove("hidden");
    chatContainer.classList.remove("hidden");
    turnText.textContent =
      data.gameState.turn === socket.id ? "Your turn" : "Opponents turn";

    drawBoard(data.gameState);
    gameState = data.gameState;

    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.addEventListener("click", (e) => {
        placeSymbol(e);
      });
    });
  }
  if (data.action === "update gameState") {
    gameState = data.gameState;
    updateBoard(gameState);
  }
});

startBtn.addEventListener("click", () => {
  startBtn.classList.add("hidden");
  loadingText.classList.remove("hidden");
  socket.emit("room", {
    action: "join room",
    pickedGame: "tic-tac-toe",
  });
});
