const canvasTextScreen = document.getElementById("canvasTextScreen");
canvasTextScreen.style.display = 'none';

const canvas = document.getElementById("gameScreen");

const WIDTH = 800;
const HEIGTH = 400;

canvas.width = WIDTH;
canvas.heigth = HEIGTH;

const ctx = canvas.getContext("2d");

ctx.fillStyle = '#000';
ctx.font = "30px Rajdhani";
ctx.fillRect(0,0,WIDTH,HEIGTH);

function gameState(){ 
  canvasTextScreen.style.display = 'none';
  this.canRestart = false;
  this.pointsDict = {
    4:10,
    3:20,
    2:30,
    1:40,
    0:50
  },
  this.timerTicks = 0;
  this.pause = false;
  this.gameLevel = 0;
  this.gamePoints = 0;
  this.playerLifes = 4;
  this.blocksDestroyed = 0;
  this.player = new Player((WIDTH/2) - (150/2), 350, 150, 10, ctx);
  this.ball = new Ball((WIDTH/2) - 8, HEIGTH, 8, 4, ctx);
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
  this.timerId = setInterval(updateGameArea, 1);
}

let game = new gameState();

function updateGameArea(){
  if(!game.pause){
    game.timerTicks += 1;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, WIDTH, HEIGTH);
    game.player.movePlayer();
    for(let i=0; i < game.allLevelBlocks.length; i++){
      for(let j=0; j < game.allLevelBlocks[i].length; j++){
        game.allLevelBlocks[i][j].drawBlock();
      }
    }

    game.ball.ballMovement();
    game.ball.drawBall();
    game.player.drawPlayer();
    if (game.timerTicks > 100){
      game.ball.ballChangeDirection(detectCollision(game.ball, game.player));
    }
    
    let blockThatCollide = detectBlockCollision(game.ball, game.allLevelBlocks);
    if (blockThatCollide) {
      game.gamePoints += game.pointsDict[blockThatCollide[0]];
      game.allLevelBlocks[blockThatCollide[0]].splice([blockThatCollide[1]], 1)
      game.ball.ballChangeDirection('topCollide');
      if(blockThatCollide[0] < game.ball.level){
        game.ball.speed = game.ball.levelSpeed[blockThatCollide[0]];
      }
    }
    if(game.playerLifes < 0){
      finishGame('GAME OVER');
    }
    if(game.blocksDestroyed >= 45){
      finishGame('YOU WIN');
    }
  }
  ctx.fillStyle = 'orange';
  ctx.fillText(game.playerLifes+1, 20, HEIGTH-20);
  console.log(game.blocksDestroyed)
}

document.addEventListener('keydown', controlKeydown);
canvas.addEventListener('mousemove', (event) => {
  game.player.x = event.layerX-75;
})

function controlKeydown(event) {
  switch (event.keyCode) {
    case 37: // <- left
      game.player.changePlayerMovement('left');
      break;
    case 39: // -> right
      game.player.changePlayerMovement('right');
      break;
    case 13:
      if(game.canRestart){
        game = new gameState();
      }
  }
}