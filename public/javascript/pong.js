const pongContainer = document.querySelector(".pongContainer");
const startBtn = document.querySelector(".startBtn");
const loadingText = document.querySelector(".loadingText");

let gameState;

socket.on("room", (data) => {
  if (data.action === "joined room") {
    socket.emit("pong-game", {
      action: "start game",
    });
  }
});

socket.on("pong-game", (data) => {
  if (data.action === "initial gameState") {
    loadingText.classList.add("hidden");
    pongContainer.classList.remove("hidden");
    gameState = data.gameState;

    if (socket.id === gameState.playerOne) {
      playerPad.playerOnePosition();
      opponentPad.playerTwoPosition();
    } else {
      playerPad.playerTwoPosition();
      opponentPad.playerOnePosition();
    }
    //test delay
    console.log(new Date().getMilliseconds());
  }

  if (data.action === "opponent pad position") {
    opponentPad.updatePosition(data.position);
  }
});

startBtn.addEventListener("click", () => {
  startBtn.classList.add("hidden");
  loadingText.classList.remove("hidden");
  socket.emit("room", {
    action: "join room",
    pickedGame: "pong",
  });
});

let ball;
let playerPad;
let opponentPad;

const FPS = 50;
const BALL_SPEED = 5;
const BALL_SIZE = 10;
const PAD_SPEED = 8;
const HIT_MARGIN = 6;

function setup() {
  const canvas = createCanvas(320, 600);
  canvas.parent("sketch-holder");
  canvas.style("display", "block");
  background(236, 236, 236);
  frameRate(FPS);

  ball = new Ball();
  playerPad = new Pad();
  opponentPad = new Pad();
}

function draw() {
  if (gameState) {
    background(236, 236, 236);

    if (keyIsDown(LEFT_ARROW) || mouseX < pmouseX) {
      playerPad.moveLeft();
    }
    if (keyIsDown(RIGHT_ARROW) || mouseX > pmouseX) {
      playerPad.moveRight();
    }

    ball.show();
    playerPad.show();
    opponentPad.show();
    ball.update();
  }
}
