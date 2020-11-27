function Player(x, y, width, heigth, ctx) {
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.width = width;
  this.heigth = heigth;
  this.drawPlayer = () => {
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(this.x, this.y, this.width, this.heigth);
  }
  this.speedX = 0;
  this.friction = 0.95;

  this.changePlayerMovement = (direction) => {
    let directions = { 'left': -2, 'right': 2 };
    this.speedX = directions[direction];
  }

  this.movePlayer = () => {
    if (this.x >= 0 && this.x + this.width <= 800) {
      this.x += this.speedX;
      if (this.speedX != 0) {
        if (this.speedX > 0) {
          this.speedX *= this.friction;
        }
        if (this.speedX < 0) {
          this.speedX *= this.friction;
        }
      }
    }
    else if (this.x <= 0) {
      this.x = 0;
    }
    else if (this.x + this.width >= 799) {
      this.x = 800 - this.width;
    }
  }
}

function Ball(x, y, radius, ctx){
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.speed = 1;
  this.aceleration = 2;
  this.direction;
  this.circle;
  
  this.ballStart = () => {
    directions = ['rightUp', 'leftUp'];
    this.direction = directions[Math.floor(Math.random() * directions.length)];
  }

  this.ballMovement = () => {
    switch (this.direction){
      case 'leftUp': 
        this.x -= this.speed;
        this.y -= this.speed;
        break;
      case 'rightUp': 
        this.x += this.speed;
        this.y -= this.speed;
        break;
      case 'leftDown':
        this.x -= this.speed;
        this.y += this.speed;
      case 'rightDown':
        this.x += this.speed;
        this.y += this.speed;
    }
  }

  this.drawBall = () => {
    this.ctx.beginPath();
    this.circle = this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    this.ctx.closePath();
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fill();
  }
}