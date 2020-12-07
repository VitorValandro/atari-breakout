/*
  Arquivo que contém funções gerais e utilidades genéricas no jogo,
  principalmente as colisõses
*/

// Função que gera todos os blocos no início do jogo
function generateBlocks(level, ctx){ 
  let blocksArray = [];

  let colors = {
    // degradê de cores (de cima para baixo)
    0:'#7B047B',
    1:'#900090',
    2:'#ad00ad',
    3:'#BF0CBF',
    4:'#D524D5'
  }

  for(let x=0;x<9;x++){
    // instancia os 9 blocos para cada uma das linhas
    blocksArray.push(new Block(10 + x * 87.5, level * 45 + 10, 80, 35, colors[level], level, ctx));
  }
  return blocksArray;
}

function detectCollision(ball, obj2) { // responsável por detectar a colisão entre a bola, o Tab e as paredes
  //colisão com o Tab
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
  // colisão com o fundo
  if (ball.y > HEIGTH+10){
    ball.ballOver();
  }
  return false;
}

function detectBlockCollision(ball, blocksArray){ // detecta colisão da bola com os blocos
  for (let i = 0; i < blocksArray.length; i++) {
    for (let j = 0; j < blocksArray[i].length; j++) {
      // itera para cada um dos blocos
      let block = blocksArray[i][j];

      if (ball.x > block.x && ball.x < block.x + block.width) {
        if (ball.y > block.y && ball.y < block.y + block.heigth) {
          game.blockHitAudio.sound.play();
          game.blocksDestroyed++;
          // retorna a posição do bloco
          return ([i, j]);
        }
      }
    }
  }
  return false;
}

function finishGame(message) { // tela que aparece quando o jogador ganha ou perde
  clearInterval(game.timerId);
  canvasTextScreen.style.display = 'block';
  document.getElementById('topTitle').innerText = message; // muda conforme o estado (YOU WIN || GAME OVER)
  document.getElementById('centerSpan').innerText = game.gamePoints;
  document.getElementById('bottomMessage').innerText = 'PRESS START TO PLAY AGAIN';
  game.canRestart = true; // altera a flag de possibilidade de reinicio
}

function Sound(src) { // objeto que controla os sons do jogo
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () { // método que toca a música
    this.sound.play();
  }
}

function muteSound(){ // silencia os sons do jogo
  let audios = document.querySelectorAll("audio");
  for(let i=0;i<audios.length;i++){
    if(muteFlag){
      audios[i].muted = false; // silencia o som
      document.getElementById('soundImg').src = 'assets/unmute.png'; // troca o ícone de áudio (ligado/desligado)
    }
    else{
      audios[i].muted = true;
      document.getElementById('soundImg').src = 'assets/mute.png';
    }
  }
  muteFlag = !muteFlag;
}

function showInfo(){ // mostra e esconde o display de ajuda
  if(infoFlag){
    document.getElementById('infoDiv').style.display = 'none'; // esconde
  }
  else{
    document.getElementById('infoDiv').style.display = 'flex'; // mostra
  }
  infoFlag = !infoFlag; // flag de controle para ver se está mostrando ou escondendo
}