const pongContainer = document.querySelector(".pongContainer");
const startBtn = document.querySelector(".startBtn");
const loadingText = document.querySelector(".loadingText");
const gameOverDiv = document.querySelector(".gameOver");
const playAgainBtn = gameOverDiv.querySelector(".playAgainBtn");

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
    playerScoreText = "YOU:  0";
    opponentScoreText = "OPPONENT:  0";
    countDown = 3;
    scorePause = false;

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
      playerScoreText = `YOU:  ${data.gameState.score.playerOne}`;
      opponentScoreText = `OPPONENT:  ${data.gameState.score.playerTwo}`;
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

playAgainBtn.addEventListener("click", () => {
  gameState = null;
  pongContainer.classList.add("hidden");
  gameOverDiv.classList.add("hidden");
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
let playerScoreText = "YOU:  0";
let opponentScoreText = "OPPONENT:  0";
let scorePause;
let scorePauseFrameCounter = 0;
let countDown;
let countDownFrameCounter = 0;

const FPS = 50;
const BALL_SPEED = 5;
const BALL_SIZE = 10;
const PAD_SPEED = 12;
const WALL_OFFSET = 3;
const HIT_MARGIN = 6;
const MINIMUM_BALL_ANGLE = 0.3;
const SCORE_PAUSE_FRAMES = 150;
const COUNT_DOWN_FRAMES = 60;

function setup() {
  const canvas = createCanvas(320, 600);
  canvas.parent("sketch-holder");
  canvas.style("display", "block");
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
    rect(0, 0, WALL_OFFSET, height);
    rect(width - WALL_OFFSET, 0, WALL_OFFSET, height);
    textSize(15);
    textAlign(LEFT);
    if (socket.id === gameState.playerOne) {
      text(playerScoreText, 10, height - 10);
      text(opponentScoreText, 10, 20);
    } else {
      text(opponentScoreText, 10, height - 10);
      text(playerScoreText, 10, 20);
    }

    if (!gameState.winner) {
      if (countDown) {
        //show countdown at start
        textSize(60);
        textAlign(CENTER);
        text(countDown, 0, height / 2 - 35, width, 70);
        countDownFrameCounter++;
        if (countDownFrameCounter >= COUNT_DOWN_FRAMES) {
          countDown--;
          countDownFrameCounter = 0;
        }
        playerPad.show();
        opponentPad.show();
      } else if (scorePause) {
        //show score update after scored point
        textSize(30);
        textAlign(CENTER);
        if (gameState.latestPoint === socket.id) {
          text("SCORE!!!", 0, height / 2 - 30, width, 70);
        } else {
          text("TOO BAD!!!", 0, height / 2 - 30, width, 70);
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
        scorePauseFrameCounter++;
        if (scorePauseFrameCounter >= SCORE_PAUSE_FRAMES) {
          scorePauseFrameCounter = 0;
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
      gameOverDiv.classList.remove("hidden");
    }
  }
}
