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

    //test delay
    console.log(new Date().getMilliseconds());
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

const FPS = 30;
const BALL_SPEED = 2;
const BALL_SIZE = 10;
// const WALL_OFFSET = 20;

class Ball {
  constructor() {
    this.speed = BALL_SPEED;
    this.size = BALL_SIZE;
    this.x = width / 2;
    this.y = height / 2;
    //adjust for different screen sizes
    this.velocityX = this.speed * (width / 200);
    this.velocityY = this.speed * (height / (200 * (height / width)));
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.bounce();
  }

  bounce() {
    if (this.x <= this.size || this.x + this.size >= width) {
      this.velocityX *= -1;
    }
    if (this.y <= this.size || this.y + this.size >= height) {
      this.velocityY *= -1;
    }
  }

  show() {
    ellipse(this.x, this.y, this.size, this.size);
  }
}

function setup() {
  const canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent("sketch-holder");
  background(236, 236, 236);
  frameRate(FPS);

  ball = new Ball();
}

function draw() {
  if (gameState) {
    background(236, 236, 236);

    ball.show();
    ball.update();
  }
}
