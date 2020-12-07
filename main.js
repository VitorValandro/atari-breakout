/*
  Arquivo principal responsável pela captura de eventos,
  loop do jogo e constantes e variáveis gerais
*/


/* CONSTANTES E VARIÁVEIS */
const canvasTextScreen = document.getElementById("canvasTextScreen");
canvasTextScreen.style.display = 'none';

const canvas = document.getElementById("gameScreen");
canvas.style.display = 'none';

const WIDTH = 800;
const HEIGTH = 400;

canvas.width = WIDTH;
canvas.heigth = HEIGTH;

let muteFlag = false; // flag do som
let infoFlag = false; // flag da tela de info

const ctx = canvas.getContext("2d"); 

ctx.fillStyle = '#22003c'; // pinta o fundo da tela
ctx.fillRect(0, 0, WIDTH, HEIGTH);

let game; // variável onde fica o objeto do jogo

function gameState(){ // Objeto principal do jogo. Armazena todo seu estado
  // CONSTRUTOR
  this.blockHitAudio = new Sound('assets/hit-block.wav'); // som quando bate no bloco e nas paredes
  this.padHitAudio = new Sound('assets/hit-pad.wav'); // som quando bate no pad
  this.canRestart = false;
  this.pointsDict = {
    4:10,
    3:20,
    2:30,
    1:40,
    0:50
  },
  this.timerTicks = 0;
  this.pause = false; // flag de pause
  this.gameLevel = 0;
  this.gamePoints = 0;
  this.playerLifes = 4; // vidas do usuário
  this.blocksDestroyed = 0; // conta quantos blocos foram destruídos -> usado para verificar se ganhou o jogo
  this.tab = new Tab((WIDTH/2) - (150/2), 350, 150, 10, ctx); // inicia o objeto da prancha
  this.ball = new Ball((WIDTH/2) - 8, HEIGTH, 8, 4, ctx); // inicia o objeto da bola
  /* GERA OS BLOCOS DE CADA LINHA (QUANTO MAIS PRA CIMA, MAIOR O NÍVEL) */
  this.level0Blocks = generateBlocks(0, ctx);
  this.level1Blocks = generateBlocks(1, ctx);
  this.level2Blocks = generateBlocks(2, ctx);
  this.level3Blocks = generateBlocks(3, ctx); 
  this.level4Blocks = generateBlocks(4, ctx);
  this.allLevelBlocks = [
    this.level0Blocks,
    this.level1Blocks,
    this.level2Blocks,
    this.level3Blocks,
    this.level4Blocks
  ]
  this.ball.ballStart(); 
  this.timerId = setInterval(updateGameArea, 1); // chama a função de atualização a cada 1 ms

  canvasTextScreen.style.display = 'none';
}

function updateGameArea(){ // responsável por atualizar a tela
  if(!game.pause){ // verifica se o jogo não está pausado
    /* ATUALIZA AS POSIÇÕES E DESENHA AS ENTIDADES */
    game.timerTicks += 1;
    ctx.fillStyle = "#1f0020";
    ctx.fillRect(0, 0, WIDTH, HEIGTH);
    game.tab.moveTab(); 
    for(let i=0; i < game.allLevelBlocks.length; i++){
      for(let j=0; j < game.allLevelBlocks[i].length; j++){
        game.allLevelBlocks[i][j].drawBlock(); // pinta os blocos
      }
    }

    game.ball.ballMovement();
    game.ball.drawBall(); // pinta a bola
    game.tab.drawTab(); // pinta o Tab
    if (game.timerTicks > 100){
      game.ball.ballChangeDirection(detectCollision(game.ball, game.tab));
    }
    
    /* VERIFICA AS COLISÕES */
    let blockThatCollide = detectBlockCollision(game.ball, game.allLevelBlocks);
    if (blockThatCollide) {
      game.gamePoints += game.pointsDict[blockThatCollide[0]];
      game.allLevelBlocks[blockThatCollide[0]].splice([blockThatCollide[1]], 1)
      game.ball.ballChangeDirection('topCollide');
      if(blockThatCollide[0] < game.ball.level){
        game.ball.speed = game.ball.levelSpeed[blockThatCollide[0]];
      }
    }
    /* VERIFICA O ESTADO DO JOGO */
    if(game.playerLifes < 0){
      finishGame('GAME OVER');
    }
    if(game.blocksDestroyed >= 45){
      finishGame('YOU WIN');
    }
  }
  /* DESENHA O TEXTO */
  ctx.font = "25px Rajdhani";
  ctx.fillStyle = 'violet';
  ctx.fillText(game.playerLifes + 1, 20, HEIGTH-20);
  ctx.fillText(game.gamePoints, WIDTH-50, HEIGTH - 20);
}

/* CONTROLE DE EVENTOS DO JOGO */
document.addEventListener('keydown', controlKeydown);
canvas.addEventListener('mousemove', (event) => { // controla os eventos do mouse
  if(game){
    game.tab.x = event.offsetX-75; // move o Tab conforme a posição do mouse
  }
})

function controlKeydown(event) { // controla os eventos do teclado
  switch (event.keyCode) {
    case 37: // <- esquerda
      game.tab.changeTabMovement('left');
      break;
    case 39: // -> direta
      game.tab.changeTabMovement('right');
      break;
    case 13:
      if(game.canRestart){ // reinicia o jogo quando é possível
        game = new gameState();
      }
      break;
  }
}

function startGame(){ // função responsável por iniciar e reiniciar os estados do jogo
  canvas.style.display = 'block';
  game = new gameState();
}