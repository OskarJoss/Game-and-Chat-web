class Ball {
  constructor() {
    this.size = BALL_SIZE;
    this.speed = BALL_SPEED;
    this.pos = createVector(width / 2, height / 2);
    this.vel = createVector(1, 1).mult(this.speed);
    this.radius = this.size / 2;
  }

  show() {
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

  update() {
    this.pos.add(this.vel);
    this.wallBounce();
    this.padBounce();
  }

  wallBounce() {
    if (this.pos.x <= this.radius || this.pos.x + this.radius >= width) {
      this.vel.x *= -1;
    }
    if (this.pos.y <= this.radius || this.pos.y + this.radius >= height) {
      this.vel.y *= -1;
    }
  }

  padBounce() {
    //this logic will have to change if I want to put the player at the bottom on both screens
    //check if playerPad is on top or bottom to adjust hit area accordingly

    //top
    if (playerPad.y < height / 2) {
      const ballPos = this.pos.y - this.radius;
      if (
        ballPos > playerPad.y - HIT_MARGIN &&
        ballPos <= playerPad.y &&
        this.pos.x >= playerPad.x &&
        this.pos.x <= playerPad.x + playerPad.width
      ) {
        if (this.vel.y < 0) {
          this.vel.x = this.calculateAngle();
          this.vel.y *= -1;
          this.emitPosition();
        }
      }
    }
    //bottom
    if (playerPad.y > height / 2) {
      const ballPos = this.pos.y + this.radius;
      if (
        ballPos < playerPad.y + HIT_MARGIN &&
        ballPos >= playerPad.y &&
        this.pos.x >= playerPad.x &&
        this.pos.x <= playerPad.x + playerPad.width
      ) {
        if (this.vel.y > 0) {
          this.vel.x = this.calculateAngle();
          this.vel.y *= -1;
          this.emitPosition();
        }
      }
    }
  }

  emitPosition() {
    socket.emit("pong-game", {
      action: "ball position",
      posX: this.pos.x,
      posY: this.pos.y,
      velX: this.vel.x,
      velY: this.vel.y,
    });
  }

  updatePosition(posX, posY, velX, velY) {
    this.pos.x = posX;
    this.pos.y = posY;
    this.vel.x = velX;
    this.vel.y = velY;
  }

  calculateAngle() {
    let angle = (this.pos.x - playerPad.x) / playerPad.width;
    if (angle < 0.5) {
      angle = 1 - angle * 2;
      if (angle < MINIMUM_BALL_ANGLE) {
        angle = MINIMUM_BALL_ANGLE;
      }
      angle = -angle * this.speed;
    } else {
      angle = (angle - 0.5) * 2;
      if (angle < 1 - MINIMUM_BALL_ANGLE) {
        angle = 1 - MINIMUM_BALL_ANGLE;
      }
      angle = angle * this.speed;
    }
    return angle;
  }
}
