/*
  Arquivo que contém os objetos das entidades (Tab, Ball e Block),
  seus métodos e responsabilidades
*/

function Tab(x, y, width, heigth, ctx) { // objeto da prancha controlada pelo usuário
  // CONSTRUTOR (funciona como o do python)
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.width = width;
  this.heigth = heigth;
  this.speedX = 0;
  this.friction = 0.95;
  
  this.drawTab = () => { // método chamado no loop para desenhar
    this.ctx.fillStyle = "#9400d3";
    this.ctx.fillRect(this.x, this.y, this.width, this.heigth);
  }

  this.changeTabMovement = (direction) => { // troca a direção conforme as teclas são pressionadas
    // função apenas para as setas do teclado
    let directions = { 'left': -2, 'right': 2 };
    this.speedX = directions[direction];
  }

  this.moveTab = () => { // atualiza a posição x do Tab conforme o usuário a move
    // só mexe se o Tab estiver dentro das dimensões da tela
    if (this.x >= 0 && this.x + this.width <= WIDTH) {
      this.x += this.speedX;
      if (this.speedX != 0) {
        if (this.speedX > 0) {
          this.speedX *= this.friction; // efeito de atrito para desaceleração
        }
        if (this.speedX < 0) {
          this.speedX *= this.friction;
        }
      }
    }
    else if (this.x <= 0) { // não deixa passar do limite à esquerda
      this.x = 0;
    }
    else if (this.x + this.width >= WIDTH-1) { // não deixa passar do limite à direita
      this.x = 800 - this.width;
    }
  }
}

function Ball(x, y, radius, level, ctx){ // objeto da bola
  // CONSTRUTOR
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.level = level;
  this.direction;
  this.circle;
  this.levelSpeed = {
    0: 1.5,
    1: 1.25,
    2: 1,
    3: 1,
    4: 1
  }
  this.speed = this.levelSpeed[this.level];
  
  this.ballStart = () => { // método que define o ponto de partida e sua direção
    this.x = (WIDTH/2)-8;
    this.y = HEIGTH;
    directions = ['rightUp', 'leftUp'];
    this.direction = directions[Math.floor(Math.random() * directions.length)]; // define randomicamente a direção
  }

  this.ballOver = () => { // método chamado quando a bola cai para o fundo
    // TELA DE CONTAGEM REGRESSIVA
    document.getElementById('topTitle').innerText = '';
    document.getElementById('centerSpan').innerText = '';
    document.getElementById('bottomMessage').innerText = '';
    game.playerLifes --; // diminui uma das vidas do usuário
    if(game.playerLifes >= 0){
      game.timerTicks = 0;
      game.pause = true; // pausa o loop do jogo
      let count = 3;
      let spanElement = document.getElementById("centerSpan");
      spanElement.innerText = count;
      let countdownSpan = setInterval(() => { // faz a contagem regressiva
        count--;
        spanElement.innerText = count;
      }, 750);
      canvasTextScreen.style.display = 'block'; // mostra a tela
      setTimeout(() => {
        game.pause = false;
        canvasTextScreen.style.display = 'none'; // esconde a tela após ps 3 segundos
        clearInterval(countdownSpan);
      }, 3000);
      this.ballStart(); // reinicia a bola
    }
  }

  this.ballChangeDirection = (collision) => { // função que troca a direção da bola conforme a colisão
    if(collision){
      revertDirections = { // pega o reverso da direção atual
        'tabCollide': { // caso colidir com o Tab
          'rightUp': 'rightDown',
          'leftUp': 'leftDown',
          'rightDown': 'rightUp',
          'leftDown': 'leftUp'
        },
        'wallCollide': { // caso colidir com as paredes laterais
          'rightUp': 'leftDown',
          'leftUp': 'rightDown',
          'rightDown': 'leftDown',
          'leftDown': 'rightDown'
        },
        'topCollide':{ // caso colidir com o topo da tela
          'rightUp': 'rightDown',
          'leftUp': 'leftDown',
          'leftDown': 'rightDown',
          'rightDown': 'leftDown'
        }
      }
      
      this.direction = revertDirections[collision][this.direction]; // troca a direção
    }
    else{
      // explícito é melhor que implícito :)
      this.direction = this.direction;
    }
  }

  this.ballMovement = () => { // movimenta a bola conforme sua direção
    switch (this.direction){
      case 'leftUp': 
        this.x -= this.speed;
        this.y -= this.speed;
        break;
      case 'rightUp': 
        this.x += this.speed;
        this.y -= this.speed
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

  this.drawBall = () => { // desenha a bola no loop
    this.ctx.beginPath();
    this.circle = this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    this.ctx.closePath();
    this.ctx.fillStyle = "#FACEFA";
    this.ctx.fill();
  }
}

function Block(x, y, width, heigth, color, level, ctx){ // objeto dos blocos
  // CONSTRUTOR
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.width = width;
  this.heigth = heigth;
  this.color = color;
  this.level = level;

  this.drawBlock = () => { // desenha os blocos no loop
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.heigth);
  }
}