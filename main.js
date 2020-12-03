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

const game = {
  restart: false,
  pointsDict:{
    4:10,
    3:20,
    2:30,
    1:40,
    0:50
  },
  timerId: 0,
  timerTicks: 0,
  pause: false,
  gameLevel: 0,
  gamePoints: 0,
  playerLifes: 4,
  update: updateGameArea,
  player: new Player((WIDTH/2) - (150/2), 350, 150, 10, ctx),
  ball: new Ball((WIDTH/2) - 8, HEIGTH, 8, 4, ctx),
  level0Blocks: generateBlocks(0, ctx),
  level1Blocks: generateBlocks(1, ctx),
  level2Blocks: generateBlocks(2, ctx),
  level3Blocks: generateBlocks(3, ctx),
  level4Blocks: generateBlocks(4, ctx),
}

let allLevelBlocks = [
  game.level0Blocks, 
  game.level1Blocks, 
  game.level2Blocks, 
  game.level3Blocks,
  game.level4Blocks
]

function updateGameArea(){
  if(!game.pause){
    game.timerTicks += 1;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, WIDTH, HEIGTH);
    game.player.movePlayer();
    for(let i=0; i < allLevelBlocks.length; i++){
      for(let j=0; j < allLevelBlocks[i].length; j++){
        allLevelBlocks[i][j].drawBlock();
      }
    }

    game.ball.ballMovement();
    game.ball.drawBall();
    game.player.drawPlayer();
    if (game.timerTicks > 100){
      game.ball.ballChangeDirection(detectCollision(game.ball, game.player));
    }
    
    let blockThatCollide = detectBlockCollision(game.ball, allLevelBlocks);
    if (blockThatCollide) {
      game.gamePoints += game.pointsDict[blockThatCollide[0]];
      allLevelBlocks[blockThatCollide[0]].splice([blockThatCollide[1]], 1)
      game.ball.ballChangeDirection('topCollide');
      if(blockThatCollide[0] < game.ball.level){
        game.ball.speed = game.ball.levelSpeed[blockThatCollide[0]];
      }
    }
    if(game.playerLifes < 0){
      gameOver();
    }
  }
  ctx.fillStyle = 'orange';
  ctx.fillText(game.playerLifes+1, 20, HEIGTH-20);
}

game.ball.ballStart();
game.timerId = setInterval(game.update, 1);

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
    case 32:
      if(game.restart){
        break;
      }
  }
}