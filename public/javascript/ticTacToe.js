const ticTacToeContainer = document.querySelector(".ticTacToeContainer");
const board = document.querySelector(".board");
const startBtn = document.querySelector(".startBtn");
const loadingDiv = document.querySelector(".loadingDiv");
const turnText = document.querySelector(".turnText");
const chatContainer = document.querySelector(".chatContainer");
const gameOverDiv = document.querySelector(".gameOver");
const gameOverText = gameOverDiv.querySelector(".gameOverText");
const playAgainBtn = document.querySelector(".playAgainBtn");
const chatIconContainer = document.querySelector(".chatIconContainer");
const closeChatBtn = chatContainer.querySelector(".closeButton");
const unreadMessages = chatIconContainer.querySelector(".unreadMessages");
const textContainer = document.querySelector(".textContainer");

let gameState;

//functions

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
    turnText.textContent = "Game over";
    if (gameState.winner === "draw") {
      gameOverText.textContent = "Draw";
    } else {
      gameOverText.textContent =
        gameState.winner === socket.id ? "You win!" : "You loose!";
    }
    gameOverDiv.classList.remove("hidden");
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.removeEventListener("click", handleSquareClick);
    });
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

//added to be able to remove eventlisteners
const handleSquareClick = (e) => {
  placeSymbol(e);
};

//socket events

socket.on("room", (data) => {
  if (data.action === "joined room") {
    socket.emit("tic-tac-toe", {
      action: "start game",
    });
  }
  if (data.action === "opponent disconnected") {
    //dont show disconnect-screen if game is over
    if (!gameState.winner) {
      window.location.replace("/disconnect.html?game=tictactoe");
    }
  }
});

socket.on("tic-tac-toe", (data) => {
  if (data.action === "initial gameState") {
    loadingDiv.classList.add("hidden");
    ticTacToeContainer.classList.remove("hidden");
    chatIconContainer.classList.remove("hidden");
    turnText.textContent =
      data.gameState.turn === socket.id ? "Your turn" : "Opponents turn";

    drawBoard(data.gameState);
    gameState = data.gameState;

    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.addEventListener("click", handleSquareClick);
    });
  }

  if (data.action === "update gameState") {
    gameState = data.gameState;
    updateBoard(gameState);
  }
});

//event listeners

startBtn.addEventListener("click", () => {
  startBtn.classList.add("hidden");
  textContainer.classList.add("hidden");
  loadingDiv.classList.remove("hidden");
  socket.emit("room", {
    action: "join room",
    pickedGame: "tic-tac-toe",
  });
});

playAgainBtn.addEventListener("click", () => {
  board.innerHTML = "";
  ticTacToeContainer.classList.add("hidden");
  gameOverDiv.classList.add("hidden");
  chatIconContainer.classList.add("hidden");
  loadingDiv.classList.remove("hidden");
  socket.emit("room", {
    action: "join room",
    pickedGame: "tic-tac-toe",
  });
});

chatIconContainer.addEventListener("click", () => {
  chatContainer.classList.remove("hidden");
  unreadMessages.classList.add("hidden");
});

closeChatBtn.addEventListener("click", () => {
  chatContainer.classList.add("hidden");
});
