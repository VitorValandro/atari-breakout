const canvas = document.getElementById("gameScreen");
var ctx = canvas.getContext("2d");

ctx.fillStyle = '#000';
ctx.fillRect(0,0,800,400);

const game = {
  update: updateGameArea,
  player: new Player(325, 350, 150, 10, ctx),
  ball: new Ball(392, 400, 8, ctx)
}

function updateGameArea(){
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 800, 400);
  game.player.movePlayer();
  game.player.drawPlayer();
  game.ball.ballMovement();
  game.ball.drawBall();
}
game.ball.ballStart();
var timerId = setInterval(game.update, 1);

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