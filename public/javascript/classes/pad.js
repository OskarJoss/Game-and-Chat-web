class Pad {
  constructor() {
    this.width = 100;
    this.height = 3;
    this.x = width / 2 - this.width / 2;
    this.y = -100;
    this.vel = PAD_SPEED;
  }

  show() {
    rect(this.x, this.y, this.width, this.height);
  }

  playerOnePosition() {
    //put outside canvas before starting and getting correct pos depending on who is player one
    this.y = height - 60;
  }

  playerTwoPosition() {
    this.y = 60;
  }

  moveLeft() {
    if (this.x > 0) {
      this.x -= this.vel;
    }
    this.emitPosition();
  }

  moveRight() {
    if (this.x < width - this.width) {
      this.x += this.vel;
    }
    this.emitPosition();
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

  reset() {
    this.x = width / 2 - this.width / 2;
  }
}
