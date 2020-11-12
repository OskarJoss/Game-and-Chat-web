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

  bottomPosition() {
    //put outside canvas before starting and get correct pos depending on who is player one
    this.y = height - 60;
  }

  topPosition() {
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

  //used to update opponentPad, mirror position to show both players at bottom
  updatePosition(posX) {
    this.x = width - (posX + this.width);
  }

  reset() {
    this.x = width / 2 - this.width / 2;
  }
}
