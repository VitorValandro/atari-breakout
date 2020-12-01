const canvas = document.getElementById("gameScreen");
var ctx = canvas.getContext("2d");

ctx.fillStyle = '#000';
ctx.fillRect(0,0,800,400);

const game = {
  timerId: 0,
  timerTicks: 0,
  gameLevel: 0,
  update: updateGameArea,
  player: new Player(325, 350, 150, 10, ctx),
  ball: new Ball(392, 400, 8, 4, ctx),
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
  game.timerTicks += 1;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 800, 400);
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
    allLevelBlocks[blockThatCollide[0]].splice([blockThatCollide[1]], 1)
    game.ball.ballChangeDirection('topCollide');
    if(blockThatCollide[0] < game.ball.level){
      game.ball.speed = game.ball.levelSpeed[blockThatCollide[0]];
    }
  }
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
  }
}