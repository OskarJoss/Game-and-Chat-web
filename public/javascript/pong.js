const pongContainer = document.querySelector(".pongContainer");
const startBtn = document.querySelector(".startBtn");
const loadingText = document.querySelector(".loadingText");

let gameState;

//socket events
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

    ball.updateDirection(gameState.ballAngle.velX, gameState.ballAngle.velY);

    if (socket.id === gameState.playerOne) {
      playerPad.playerOnePosition();
      opponentPad.playerTwoPosition();
    } else {
      playerPad.playerTwoPosition();
      opponentPad.playerOnePosition();
    }
  }

  if (data.action === "new ball position") {
    ball.updatePosition(data.posX, data.posY, data.velX, data.velY);
  }

  if (data.action === "opponent pad position") {
    opponentPad.updatePosition(data.position);
  }

  if (data.action === "point scored") {
    gameState = data.gameState;
    if (socket.id === gameState.playerOne) {
      playerScoreText = `YOU: ${data.gameState.score.playerOne}`;
      opponentScoreText = `OPPONENT: ${data.gameState.score.playerTwo}`;
    } else {
      playerScoreText = `YOU: ${data.gameState.score.playerTwo}`;
      opponentScoreText = `OPPONENT: ${data.gameState.score.playerOne}`;
    }
    playerPad.reset();
    opponentPad.reset();
    ball.reset();
    ball.updateDirection(gameState.ballAngle.velX, gameState.ballAngle.velY);
    scorePause = true;
  }
});

//event listeners
startBtn.addEventListener("click", () => {
  startBtn.classList.add("hidden");
  loadingText.classList.remove("hidden");
  socket.emit("room", {
    action: "join room",
    pickedGame: "pong",
  });
});

//p5js logic
let ball;
let playerPad;
let opponentPad;
let playerScoreText = "YOU: 0";
let opponentScoreText = "OPPONENT: 0";
let scorePause = false;
let scorePauseCounter = 0;

const FPS = 50;
const BALL_SPEED = 5;
const BALL_SIZE = 10;
const PAD_SPEED = 12;
const HIT_MARGIN = 6;
const MINIMUM_BALL_ANGLE = 0.3;
const SCORE_PAUSE_FRAMES = 150;

function setup() {
  const canvas = createCanvas(320, 600);
  canvas.parent("sketch-holder");
  canvas.style("display", "block");
  background(236, 236, 236);
  frameRate(FPS);
  textFont("Righteous");

  ball = new Ball();
  playerPad = new Pad();
  opponentPad = new Pad();
}

function draw() {
  if (gameState) {
    background(0, 0, 0);
    stroke(255, 255, 255);
    fill(255, 255, 255);

    if (!gameState.winner) {
      if (scorePause) {
        //score pause loop
        textSize(30);
        textAlign(CENTER);
        if (gameState.latestPoint === socket.id) {
          text("SCORE!!", 0, height / 2 - 30, width, 70);
        } else {
          text("TOO BAD!", 0, height / 2 - 30, width, 70);
        }
        if (socket.id === gameState.playerOne) {
          text(
            `${gameState.score.playerOne} - ${gameState.score.playerTwo}`,
            0,
            height / 2 + 30,
            width,
            70
          );
        } else {
          text(
            `${gameState.score.playerTwo} - ${gameState.score.playerOne}`,
            0,
            height / 2 + 30,
            width,
            70
          );
        }
        scorePauseCounter++;
        if (scorePauseCounter >= SCORE_PAUSE_FRAMES) {
          scorePauseCounter = 0;
          scorePause = false;
        }
      } else {
        //main game loop
        if (keyIsDown(LEFT_ARROW) || mouseX < pmouseX) {
          playerPad.moveLeft();
        }
        if (keyIsDown(RIGHT_ARROW) || mouseX > pmouseX) {
          playerPad.moveRight();
        }

        textSize(15);
        textAlign(LEFT);
        if (socket.id === gameState.playerOne) {
          text(playerScoreText, 10, height - 10);
          text(opponentScoreText, 10, 20);
        } else {
          text(opponentScoreText, 10, height - 10);
          text(playerScoreText, 10, 20);
        }

        ball.show();
        playerPad.show();
        opponentPad.show();
        ball.update();
      }
    } else {
      //display winner
      textSize(30);
      textAlign(CENTER);
      if (socket.id === gameState.winner) {
        text("YOU WIN!!", 0, height / 2 - 30, width, 70);
      } else {
        text("YOU LOOSE!!", 0, height / 2 - 30, width, 70);
      }
    }
  }
}
