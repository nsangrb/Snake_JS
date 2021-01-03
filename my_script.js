let lastRenderTime = 0;

let score = 0;

const SCORE = 10;
let SNAKE_SPEED = 10;
let GRID_SIZE = 20;
const gameregion = document.getElementById("game_region");
let snakeBody = [
  { x: 3, y: 1 },
  { x: 2, y: 1 },
  { x: 1, y: 1 },
];

const toDo = ["r"];

let inputDirection = { x: 1, y: 0 };
let lastInputDirection = { x: 0, y: 0 };

let IsOver = false,
  IsStop = true;

let food = getnewFood();
const EXPANSION_RATE = 1;
let grow = 0;

let IsBox = true;

let game_size_z = 20,
  snake_speed_z = 10;
function main(currentTime) {
  window.requestAnimationFrame(main);
  if (IsStop) {
    return;
  }
  const secsSinceLastRender = (currentTime - lastRenderTime) / 1000;
  if (secsSinceLastRender < 1 / SNAKE_SPEED) return;
  update();
  check_over();
  if (IsOver) {
    endGame();
    return;
  }
  draw();
  lastRenderTime = currentTime;
}

draw();
window.requestAnimationFrame(main);

function update() {
  updateSnake();
  updateFood();
}

function draw() {
  gameregion.innerHTML = "";
  drawSnake(gameregion);
  drawFood(gameregion);
}

function check_over() {
  IsOver = outsideGrid(snakeBody[0]) || CheckCollision();
}

//snake
function updateSnake() {
  growSnake();
  if (toDo.length > 0) {
    console.log(toDo);
    switch (toDo[0]) {
      case "u":
        if (lastInputDirection.y !== 0) break;
        inputDirection = { x: 0, y: -1 };
        break;
      case "d":
        if (lastInputDirection.y !== 0) break;
        inputDirection = { x: 0, y: 1 };
        break;
      case "l":
        if (lastInputDirection.x !== 0) break;
        inputDirection = { x: -1, y: 0 };
        break;
      case "r":
        if (lastInputDirection.x !== 0) break;
        inputDirection = { x: 1, y: 0 };
        break;
    }
    toDo.splice(0, 1);
  }
  const Direction = getInputDirection();
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] };
  }
  snakeBody[0].x += Direction.x;
  snakeBody[0].y += Direction.y;
  if (!IsBox) {
    if (snakeBody[0].y < 1) snakeBody[0].y = GRID_SIZE;
    else if (snakeBody[0].y > GRID_SIZE) snakeBody[0].y = 1;
    if (snakeBody[0].x < 1) snakeBody[0].x = GRID_SIZE;
    else if (snakeBody[0].x > GRID_SIZE) snakeBody[0].x = 1;
  }
}
function drawSnake(gameregion) {
  let ishead = true;
  snakeBody.forEach((segment) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    if (ishead) {
      ishead = false;
      snakeElement.classList.add("snake-head");
    } else snakeElement.classList.add("snake");
    gameregion.appendChild(snakeElement);
  });
}

function expandSnake(amount) {
  grow += amount;
}

function growSnake() {
  if (grow > 0) {
    for (let i = 0; i < grow; i++) {
      snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
    }
    grow = 0;
  }
}

function onSnake(pos, { ignoreHead = false } = {}) {
  return snakeBody.some((segment, index) => {
    if (ignoreHead && index === 0) return false;
    return IsSamePos(segment, pos);
  });
}

function CheckCollision() {
  return onSnake(snakeBody[0], { ignoreHead: true });
}

function outsideGrid(position) {
  return (
    position.x < 1 ||
    position.x > GRID_SIZE ||
    position.y < 1 ||
    position.y > GRID_SIZE
  );
}

function IsSamePos(posa, posb) {
  return posa.x === posb.x && posa.y === posb.y;
}

//food
function updateFood() {
  if (onSnake(food)) {
    expandSnake(EXPANSION_RATE);
    food = getnewFood();
    score += SCORE;
    document.getElementById("score").textContent = score;
  }
}

function drawFood(gameregion) {
  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  gameregion.appendChild(foodElement);
}

function getnewFood() {
  let newFoodPosition;
  while (newFoodPosition == null || onSnake(newFoodPosition)) {
    newFoodPosition = randomPos();
  }
  return newFoodPosition;
}

function randomPos() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE) + 1,
    y: Math.floor(Math.random() * GRID_SIZE) + 1,
  };
}

//input
window.addEventListener("keydown", (e) => {
  if (toDo.length < 2) {
    switch (e.key) {
      case "ArrowUp":
        if (IsOver || IsStop) break;
        toDo.push("u");
        //inputDirection = { x: 0, y: -1 };
        break;
      case "ArrowDown":
        if (IsOver || IsStop) break;
        toDo.push("d");
        //inputDirection = { x: 0, y: 1 };
        break;
      case "ArrowLeft":
        if (IsOver || IsStop) break;
        toDo.push("l");
        //inputDirection = { x: -1, y: 0 };
        break;
      case "ArrowRight":
        if (IsOver || IsStop) break;
        toDo.push("r");
        //inputDirection = { x: 1, y: 0 };
        break;
      case " ":
        if (IsOver) {
          IsOver = false;
          restartgame();
        } else {
          if (document.getElementById("stop_btn").disabled !== true) stopgame();
          else if (document.getElementById("start_btn").disabled !== true)
            startgame();
        }
        break;
      case "Escape":
        restartgame();
        break;
    }
  }
});

function getInputDirection() {
  lastInputDirection = inputDirection;
  return inputDirection;
}

function delay(delayInms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}
async function startgame() {
  for (i = 3; i > 0; i--) {
    document.getElementById("noti_lb").style.visibility = "visible";
    document.getElementById("noti_lb").textContent = i.toString();
    await delay(500);
    console.log(i);
  }
  document.getElementById("noti_lb").style.visibility = "hidden";
  SNAKE_SPEED = document.getElementById("snake_speed").value;

  document.getElementById("snake_speed").disabled = true;
  document.getElementById("game_size").disabled = true;
  document.getElementById("start_btn").disabled = true;
  document.getElementById("stop_btn").disabled = false;
  document.getElementById("boxmode_btn").disabled = true;
  document.getElementById("checkmark").disabled = true;
  IsStop = false;
}

function stopgame() {
  document.getElementById("noti_lb").style.visibility = "visible";
  document.getElementById("noti_lb").textContent = "STOP";
  document.getElementById("start_btn").disabled = false;
  document.getElementById("stop_btn").disabled = true;
  IsStop = true;
}

function restartgame() {
  document.getElementById("noti_lb").style.visibility = "visible";
  document.getElementById("noti_lb").textContent = "START";
  score = 0;
  document.getElementById("score").textContent = score;
  IsOver = false;
  IsStop = true;
  document.getElementById("start_btn").disabled = false;
  document.getElementById("stop_btn").disabled = true;
  document.getElementById("snake_speed").disabled = false;
  document.getElementById("game_size").disabled = false;
  document.getElementById("boxmode_btn").disabled = false;
  document.getElementById("checkmark").disabled = false;
  snakeBody = [
    { x: 3, y: 1 },
    { x: 2, y: 1 },
    { x: 1, y: 1 },
  ];
  food = getnewFood();
  draw();
  inputDirection = { x: 1, y: 0 };
}

function endGame() {
  document.getElementById("noti_lb").style.visibility = "visible";
  document.getElementById("noti_lb").innerHTML =
    "You lost!!!!<br />Score: " + score;
  IsStop = true;
  document.getElementById("stop_btn").disabled = true;
}
document.getElementById("start_btn").addEventListener("click", () => {
  startgame();
});

document.getElementById("stop_btn").addEventListener("click", () => {
  stopgame();
});

document.getElementById("restart_btn").addEventListener("click", () => {
  restartgame();
});

document.getElementById("snake_speed").addEventListener("change", () => {
  if (parseInt(document.getElementById("snake_speed").value) > 50)
    document.getElementById("snake_speed").value = 50;
  else if (parseInt(document.getElementById("game_size").value) < 1)
    document.getElementById("snake_speed").value = 1;
  else if (document.getElementById("snake_speed").value === "")
    document.getElementById("snake_speed").value = snake_speed_z;
  snake_speed_z = parseInt(document.getElementById("snake_speed").value);
});
document.getElementById("game_size").addEventListener("change", () => {
  if (parseInt(document.getElementById("game_size").value) > 100)
    document.getElementById("game_size").value = 100;
  else if (parseInt(document.getElementById("game_size").value) < 10)
    document.getElementById("game_size").value = 10;
  else if (document.getElementById("game_size").value === "")
    document.getElementById("game_size").value = game_size_z;
  game_size_z = parseInt(document.getElementById("game_size").value);
  GRID_SIZE = parseInt(document.getElementById("game_size").value);
  document
    .getElementById("game_region")
    .style.setProperty(
      "grid-template-columns",
      "repeat(" + GRID_SIZE + ", 1fr)"
    );
  document
    .getElementById("game_region")
    .style.setProperty("grid-template-rows", "repeat(" + GRID_SIZE + ", 1fr)");
  food = getnewFood();
  draw();
});

document.getElementById("boxmode_btn").addEventListener("change", () => {
  if (!IsBox) {
    IsBox = true;
    document.getElementById("game_region").style.borderColor =
      "rgb(29, 126, 126)";
  } else {
    IsBox = false;
    document.getElementById("game_region").style.borderColor =
      " rgb(188, 255, 255)";
  }
});
