function Player(x, y, width, heigth, ctx) {
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.width = width;
  this.heigth = heigth;
  
  this.drawPlayer = () => {
    this.ctx.fillStyle = "#9400d3";
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

function Ball(x, y, radius, level, ctx){
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.level = level;
  this.aceleration = 2;
  this.direction;
  this.circle;
  this.levelSpeed = {
    0: 1.5,
    1: 1.25,
    2: 1,
    3: 0.75,
    4: 0.5
  }
  this.speed = this.levelSpeed[this.level];
  
  this.ballStart = () => {
    directions = ['rightUp', 'leftUp'];
    this.direction = directions[Math.floor(Math.random() * directions.length)];
  }

  this.ballChangeDirection = (collision) => {
    if(collision){
      revertDirections = {
        'playerCollide': {
          'rightUp': 'rightDown',
          'leftUp': 'leftDown',
          'rightDown': 'rightUp',
          'leftDown': 'leftUp'
        },
        'wallCollide': {
          'rightUp': 'leftDown',
          'leftUp': 'rightDown',
          'rightDown': 'leftDown',
          'leftDown': 'rightDown'
        },
        'topCollide':{
          'rightUp': 'rightDown',
          'leftUp': 'leftDown',
          'leftDown': 'rightDown',
          'rightDown': 'leftDown'
        }
      }
      
      this.direction = revertDirections[collision][this.direction];
    }
    else{
      // explícito é melhor que implícito :)
      this.direction = this.direction;
    }
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
        break;
      case 'rightDown':
        this.x += this.speed;
        this.y += this.speed;
        break;
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

function Block(x, y, width, heigth, color, level, ctx){
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.width = width;
  this.heigth = heigth;
  this.color = color;
  this.level = level;

  this.drawBlock = () => {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.heigth);
  }
}