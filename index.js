const vectorX = [0, 1, -1, 0, 0];
const vectorY = [1, 0, 0, -1, 0];
let magnitude = 4;
const stdSize = 25;
const intial = [{ x: 0, y: 0 }];
let block = 1;
let dt = 0.3;
let score = 0;
let gameOver = false;

let randIntX = null; // doesnt matter its a square
let randIntY = null;
window.addEventListener("keydown", (ev) => {
  ev.preventDefault();
  if (gameOver === true) return;
  if (ev.keyCode === 13 || (ev.keyCode === 40 && magnitude != 3)) {
    magnitude = 0;
  } else if (ev.keyCode === 38 && magnitude != 0) {
    magnitude = 3;
  } else if (ev.keyCode === 37 && magnitude != 1) {
    magnitude = 2;
  } else if (ev.keyCode === 39 && magnitude != 2) {
    magnitude = 1;
  }
});

const food = (canvas) => {
  // 500x500 square => 500/25(std size) = 20 cells
  // generates a floting point number then gets rounded up by Math.floor()
  // so after multipying by the std size we get it in coordinate form
  randIntX = Math.floor((Math.random() * canvas.height) / stdSize) * stdSize;
  randIntY = Math.floor((Math.random() * canvas.width) / stdSize) * stdSize;
};

window.addEventListener("load", () => {
  const canvas = document.querySelector("#main");
  const stat = document.querySelector("#stat");
  const ctx = canvas.getContext("2d");
  food(canvas);

  // we need to compute the point length

  const underFrame = () => {
    const { x, y } = intial[0];
    stat.innerText = "";
    if (gameOver === true) {
      stat.innerHTML = "<h1>GAME OVER SCORE " + score + "</h1>";
    } else {
      score == 0
        ? (stat.innerText = `press enter to start`)
        : (stat.innerText += `score: ${score}`);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // check for the coordinate overflap
    const lastX = intial[0].x;
    const lastY = intial[0].y;
    for (let i = 0; i <= intial.length - 1; i++) {
      const { x, y } = intial[i];
      // check if courrent coordinate of block matches any of its past coordinate
      ctx.fillStyle = "lightgreen";
      let over = false;
      if (intial.length > 1) {
        for (let i = 0; i <= intial.length - 1; i++) {
          if (i != 0) {
            const x = intial[i].x;
            const y = intial[i].y;
            if (x == lastX && y == lastY) {
              over = true;
            }
          }
        }
      }
      if (over === false) {
        ctx.strokeStyle = "green";
        ctx.fillRect(x * stdSize, y * stdSize, stdSize, stdSize);
        ctx.strokeRect(x * stdSize, y * stdSize, stdSize, stdSize);
      } else {
        gameOver = true;
        magnitude = 4;
      }
    }
    // to make the turn work as expected we simulatneously update the array of blocks and render them in loop
    const calculatedX = vectorX[magnitude] + x;
    const calculatedY = vectorY[magnitude] + y;
    // check if appending cause box to go out of boundry
    const cX = calculatedX * stdSize;
    const cY = calculatedY * stdSize;
    if (cX === randIntX && cY === randIntY) {
      ctx.clearRect(randIntX, randIntY, stdSize, stdSize);
      food(canvas);
      block++;
      score++;
      if (dt > 0.2) {
        dt -= 0.01;
      }
    }
    if (cY < canvas.height && cY >= 0 && cX < canvas.width && cX >= 0) {
      // check if last coordinate matches any of the block coordinate
      // if block length if gereater than 1
      intial.unshift({ x: calculatedX, y: calculatedY });
    } else {
      gameOver = true;
    }
    if (!gameOver) {
      // generate um whats that thing whatever
      ctx.fillStyle = "red";
      ctx.fillRect(randIntX, randIntY, stdSize, stdSize);
    }
    if (intial.length > block) {
      intial.pop();
    }
    setTimeout(() => {
      underFrame();
    }, dt * 1000); // 1000ms = 1sec sleep
  };
  underFrame();
});
