class Pad {
  constructor() {
    this.width = 100;
    this.height = 3;
    this.x = width / 2 - this.width / 2;
    this.y = -100;
    this.velocity = 4;
  }

  show() {
    rect(this.x, this.y, this.width, this.height);
  }

  playerOnePosition() {
    this.y = height - 60;
  }

  playerTwoPosition() {
    this.y = 60;
  }

  moveLeft() {
    if (this.x > 0) {
      this.x -= this.velocity;
    }
  }

  moveRight() {
    if (this.x < width - this.width) {
      this.x += this.velocity;
    }
  }

  emitPosition() {
    socket.emit("pong-game", {
      action: "pad position",
      position: this.x,
    });
  }

  updatePosition(posX) {
    this.x = posX;
  }
}
