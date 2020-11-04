class Ball {
  constructor() {
    this.size = BALL_SIZE;
    this.speed = BALL_SPEED;
    this.pos = createVector(width / 2, height / 2);
    this.vel = createVector(1, 1).mult(this.speed);
    this.radius = this.size / 2;
  }

  update() {
    this.pos.add(this.vel);
    this.bounce();
    this.padBounce();
  }

  bounce() {
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
          this.vel.y *= -1;
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
          this.vel.y *= -1;
        }
      }
    }
  }

  show() {
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}
