function generateBlocks(level, ctx){
  let blocksArray = [];

  let colors = {
    /*0:'#730d73',
    1:'#900090',
    2:'#ad00ad',
    3:'#cf33ff',
    4:'#ff57ff'*/
    0:'#7B047B',
    1:'#900090',
    2:'#ad00ad',
    3:'#BF0CBF',
    4:'#D524D5'
  }

  for(let x=0;x<9;x++){
    blocksArray.push(new Block(10 + x * 87.5, level * 45 + 10, 80, 35, colors[level], level, ctx));
  }
  return blocksArray;
}

function detectCollision(ball, obj2) {
  if (ball.x > obj2.x && ball.x < obj2.x + obj2.width) {
    if (ball.y > obj2.y && ball.y < obj2.y + obj2.heigth) {
      game.padHitAudio.sound.play();
      return 'tabCollide';
    }
  }
  // colisão com as paredes
  if ((ball.x > WIDTH) || (ball.x < 0)) {
    game.blockHitAudio.sound.play();
    return 'wallCollide';
  }
  if (ball.y < 0) {
    game.blockHitAudio.sound.play();
    return 'topCollide';
  }
  if (ball.y > HEIGTH+10){
    ball.ballOver();
  }
  return false;
}

function detectBlockCollision(ball, blocksArray){
  for (let i = 0; i < blocksArray.length; i++) {
    for (let j = 0; j < blocksArray[i].length; j++) {
      let block = blocksArray[i][j];

      if (ball.x > block.x && ball.x < block.x + block.width) {
        if (ball.y > block.y && ball.y < block.y + block.heigth) {
          game.blockHitAudio.sound.play();
          game.blocksDestroyed++;
          return ([i, j]);
        }
      }
    }
  }
  return false;
}

function finishGame(message) {
  clearInterval(game.timerId);
  canvasTextScreen.style.display = 'block';
  document.getElementById('topTitle').innerText = message;
  document.getElementById('centerSpan').innerText = game.gamePoints;
  document.getElementById('bottomMessage').innerText = 'PRESS START TO PLAY AGAIN';
  game.canRestart = true;
}

function Sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  }
  this.stop = function () {
    this.sound.pause();
  }
}
function muteSound(){
  let audios = document.querySelectorAll("audio");
  for(let i=0;i<audios.length;i++){
    if(muteFlag){
      audios[i].muted = false;
      document.getElementById('soundImg').src = 'assets/unmute.png';
    }
    else{
      audios[i].muted = true;
      document.getElementById('soundImg').src = 'assets/mute.png';
    }
  }
  muteFlag = !muteFlag;
}

function showInfo(){
  if(infoFlag){
    document.getElementById('infoDiv').style.display = 'none';
  }
  else{
    document.getElementById('infoDiv').style.display = 'flex';
  }
  infoFlag = !infoFlag;
}