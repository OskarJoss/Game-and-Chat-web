class Ball {
  constructor() {
    this.size = BALL_SIZE;
    this.x = width / 2;
    this.y = height / 2;
    this.velocityX = BALL_SPEED_X;
    this.velocityY = BALL_SPEED_Y;
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.bounce();
  }

  bounce() {
    if (this.x <= this.size / 2 || this.x + this.size / 2 >= width) {
      this.velocityX *= -1;
    }
    if (this.y <= this.size / 2 || this.y + this.size / 2 >= height) {
      this.velocityY *= -1;
    }
  }

  show() {
    ellipse(this.x, this.y, this.size, this.size);
  }
}
