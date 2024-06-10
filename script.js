let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let flappyAudio;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight
};

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

let gameStarted = false;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  flappyAudio = document.getElementById("flappyAudio");

  birdImg = new Image();
  birdImg.src = "https://i.imgur.com/yJx9jra.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "https://i.imgur.com/QNdj3jJ.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "https://i.imgur.com/0hehD3Q.png";

  // Add start button
  const startButton = document.createElement("button");
  startButton.innerText = "Start Game";
  startButton.style.position = "absolute";
  startButton.style.left = "50%";
  startButton.style.top = "50%";
  startButton.style.transform = "translate(-50%, -50%)";
  startButton.addEventListener("click", startGameWithAudio);
  document.body.appendChild(startButton);
};

function startGameWithAudio() {
  if (!gameStarted) {
    gameStarted = true;
    document.body.removeChild(document.querySelector("button")); // Remove the start button

    // Play audio
    flappyAudio.play();

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
    document.addEventListener("click", moveBird);
    document.addEventListener("touchstart", moveBird);
  }
}

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }

  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }

  context.fillStyle = "white";
  context.font = "35px san-serif";
  const scoreText = "Score: " + score;
    const scoreTextWidth = context.measureText(scoreText).width;
    context.fillText(scoreText, (boardWidth - scoreTextWidth) / 2, 60);

  if (gameOver) {
    const gameOverTextWidth = context.measureText("GAME OVER").width;
    context.fillText("GAME OVER", (boardWidth - gameOverTextWidth) / 2, boardHeight / 2 - 50);
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingspace = board.height / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false
  };
  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingspace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false
  };
  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (
    e.code == "Space" ||
    e.code == "ArrowUp" ||
    e.code == "keyX" ||
    e.type == "click" ||
    e.type == "touchstart"
  ) {
    velocityY = -6;
    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false;
    }
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
