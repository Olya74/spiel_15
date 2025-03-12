import Player from "./player.js";
let players = [];
let currentPlayer;
let score;
let playerName = document.getElementById("playerName");
players = (JSON.parse(localStorage.getItem("players")) || []).map((obj) =>
  Player.fromJSON(obj)
);
currentPlayer =
  players.find((player) => player.active === true) || new Player("Guest");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const btnSelect = document.querySelector(".btnSelect");
let start = document.getElementById("start");
const timeEl = document.getElementById("time");
const containerNode = document.getElementById("fifteen");
const inpImg = document.getElementById("inpImg");
const imgSelect = document.getElementById("imgSelect");
const imgList = document.getElementById("imgList");
const spanName = document.getElementById("spanName");
const myPuzzle = document.getElementById("myPuzzle");
let pause = document.getElementById("pause");
let img = new Image();
let audio;

let img1 = new Image();
img1.src = "imgProject/1.png";
img1.width = 400;
img1.height = 400;

img.src = "imgProject/4.png";
canvas.width = 400;
canvas.height = 400;
let CELL_SIZE = 4;
const itemNodes = Array.from(containerNode.querySelectorAll(".item"));
const countItems = 16;
if (itemNodes.length !== countItems) {
  throw new Error("Invalid number of items");
}
itemNodes[countItems - 1].style.display = "none";
let matrix = getMatrix(itemNodes.map((item) => Number(item.dataset.matrixId)));
const puzzleWidth = canvas.width / CELL_SIZE;
const puzzleHeight = canvas.height / CELL_SIZE;
const blankNumber = countItems;
const imagePieceWidth = img.width / CELL_SIZE;
const imagePieceHeight = img.height / CELL_SIZE;

img.addEventListener("load", () => {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  setPositionItemsWithPicture(matrix, itemNodes);
});

let isPaused;
let victory;
let unvictory;
let isStarted;
let startMinutes;
let time;
let idTimer;

playerName.addEventListener("change", (e) => {
  const existingPlayer = players.find(
    (player) => player.name === e.target.value
  );
  if (existingPlayer) {
    existingPlayer.setActive(true);
    currentPlayer = existingPlayer;
  } else {
    currentPlayer = new Player(e.target.value);
    currentPlayer.setActive(true);
    players.push(currentPlayer);
  }

  // Deactivate other players
  players.forEach((player) => {
    if (player.name !== currentPlayer.name) {
      player.setActive(false);
    }
  });

  localStorage.setItem("players", JSON.stringify(players));
  spanName.textContent = `Welcome, ${currentPlayer.name}`;
  playerName.value = "";
  console.log("currentPlayer:", currentPlayer);
  // playerName.style.display = "none";
});

spanName.textContent = `Welcome, ${currentPlayer.name}`;

const init = function () {
  isPaused = false;
  isStarted = true;
  victory = false;
  unvictory = false;
  startMinutes = 10;
  time = startMinutes * 60;
  idTimer = setInterval(updateTimer, 1000);
  matrix = getMatrix(shuffleArray(matrix));
  setPositionItems(matrix, itemNodes);
};

start.addEventListener("click", () => {
  isStarted = !isStarted;
  if (isStarted) {
    init();
    start.textContent = "Stop";
    start.classList.add("active");
  } else {
    clearInterval(idTimer);
    resetTimer();
    start.textContent = "Start";
    start.classList.remove("active");
    pause.textContent = "Pause";
    pause.classList.remove("active");
    imgSelect.style.display = "block";
    matrix = getMatrix(itemNodes.map((item) => Number(item.dataset.matrixId)));
    setPositionItems(matrix, itemNodes);
  }
});

pause.addEventListener("click", () => {
  isPaused = !isPaused;
  if (isStarted && isPaused) {
    pause.textContent = "continue";
    pause.classList.add("active");
  } else {
    pause.textContent = "Pause";
    pause.classList.remove("active");
  }
});

//Eingabe ausblenden
imgSelect.addEventListener(
  "click",
  (e) => {
    if (inpImg) {
      inpImg.click();
    }
    e.preventDefault(); //prevent navigation to #
  },
  false
);

inpImg.addEventListener("change", (e) => {
  const list = document.createElement("ul");
  imgList.appendChild(list);
  let URL = window.webkitURL || window.URL;
  let files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    let myImg = new Image();
    const li = document.createElement("li");
    list.appendChild(li);
    myImg.src = URL.createObjectURL(files[i]);
    li.appendChild(myImg);
  }
  btnSelect.textContent = "Click on the selected image";
});

imgList.addEventListener("click", (e) => {
  let imgNode = e.target.closest("img");
  if (!imgNode) {
    return;
  }
  itemNodes.forEach((item) => {
    item.style.backgroundImage = `url(${imgNode.src})`;
  });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(imgNode, 0, 0, canvas.width, canvas.height);
});

myPuzzle.addEventListener("click", (e) => {
  let imgNode = e.target.closest("img");
  if (!imgNode) {
    return;
  }

  itemNodes.forEach((item) => {
    item.style.backgroundImage = `url(${imgNode.src})`;
  });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(imgNode, 0, 0, canvas.width, canvas.height);
  switch (imgNode.src.split("/").pop()) {
    case "1.png":
      myPuzzle.style.backgroundColor = "rgba(35, 71, 35, 0.38)";
      return;
    case "2.png":
      myPuzzle.style.backgroundColor = "rgb(5, 126, 141)";
      return;
    case "3.png":
      myPuzzle.style.backgroundColor = "rgb(11, 12, 73)";
      return;
    case "4.png":
      myPuzzle.style.backgroundColor = "hsl(120, 50.00%, 74.90%)";
      return;
    case "o.jpg":
      myPuzzle.style.backgroundColor = "hsl(98, 19.10%, 66.10%)";
      return;
    case "zug.jpg":
      myPuzzle.style.backgroundColor = "rgb(221, 156, 156)";

      return;
    default:
      myPuzzle.style.backgroundColor = "black";
      return;
  }
});

//um eine button füt shuffle zu erstellen

// document.getElementById("shuffle").addEventListener("click", () => {
//   matrix = getMatrix(shuffleArray(matrix));
//   setPositionItems(matrix, itemNodes);
// });

containerNode.addEventListener("click", (e) => {
  const buttonNode = e.target.closest("button");
  if (!buttonNode) {
    return;
  }
  const buttonValue = Number(buttonNode.dataset.matrixId);
  const blankCoord = coordByValue(matrix, blankNumber);
  const buttonCoord = coordByValue(matrix, buttonValue);
  const isValid = isValidForSwap(blankCoord, buttonCoord);
  if (isValid) {
    swap(blankCoord, buttonCoord, matrix);
    setPositionItems(matrix, itemNodes);
  }
  if (isVictory(matrix)) {
    victory = true;
    audio = audioWithPath("imgProject/victory.mp3");
    createBtnAudio(audio);
    clearInterval(idTimer);
    score = time / 10;
    let name = currentPlayer.name;
    createInfo(name, score, time);
    currentPlayer.addScore(score);
    localStorage.setItem("players", JSON.stringify(players));
    // isStarted = false;
    // start.textContent = "Start";
    // start.classList.remove("active");
  }

  setTimeout(() => {
    info.style.display = "none";
  }, 2000);
});

/* helpers */

function setTimerStyle() {
  timeEl.style.backgroundColor = "black";
  timeEl.style.color = "white";
  timeEl.style.fontSize = "2rem";
  timeEl.style.textAlign = "center";
  timeEl.style.display = "inline-block";
  timeEl.style.padding = "0.5rem 3rem";
  timeEl.style.borderRadius = "0.5rem";
  timeEl.style.boxShadow = "0 0 0.8rem  #da1939fa";
  timeEl.previousSibling.textContent = "Time has begun: ";
}

function updateTimer() {
  if (!isPaused) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    timeEl.innerHTML = `${minutes}:${seconds}`;
    setTimerStyle();
    time--;
  }
  if (time < 0) {
    unvictory = true;
    clearInterval(idTimer);
    audioWithPath("imgProject/ups.mp3");
    resetTimer();
    start.textContent = "Start";
    start.classList.remove("active");
    alert("Time is over");
  }
}
function resetTimer() {
  time = startMinutes * 60;
  timeEl.innerHTML = "";
  timeEl.previousSibling.textContent = "You have 15 minutes";
  timeEl.style.display = "none";
  start.removeAttribute("disabled");
  start.style.opacity = 1;
}

function getMatrix(array) {
  const matrix = [];
  while (array.length) {
    matrix.push(array.splice(0, 4));
  }
  return matrix;
}

function setPositionItems(matrix, arr) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const itemNode = arr[matrix[i][j] - 1];

      setNodesStyle(itemNode, j, i);
    }
  }
}
function setNodesStyle(node, x, y, shiftPs = 100) {
  node.style.transform = `translate3D(${x * shiftPs}%,${y * shiftPs}%,0)`;
}

function setPositionItemsWithPicture(matrix, arr) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      let itemNodeImg = arr[matrix[i][j] - 1];
      const sizeMatrixCell = matrix[i].length;
      const itemNode = matrix[i][j];
      const srcCol = (itemNode - 1) % sizeMatrixCell;
      const srcRow = Math.floor((itemNode - 1) / sizeMatrixCell);

      // Координаты на canvas (назначение)
      const destX = j * puzzleWidth;
      const destY = i * puzzleHeight;

      if (itemNode !== blankNumber) {
        setNodesStyleWithPicture(srcCol, srcRow, destX, destY, itemNodeImg);
      } else {
        // Для пустого сектора делаем его белым
        ctx.fillStyle = "white";
        ctx.fillRect(destX, destY, puzzleWidth, puzzleHeight);
        itemNodeImg.style.backgroundImage = "none";
      }
    }
  }
}
function setNodesStyleWithPicture(srcCol, srcRow, destX, destY, node) {
  node.style.transform = `translate3D(${srcCol * puzzleWidth}%,${
    srcRow * puzzleHeight
  }%,0)`;
  ctx.clearRect(0, 0, CELL_SIZE, CELL_SIZE);
  ctx.fillStyle = "white";
  ctx.drawImage(
    img,
    srcCol * imagePieceWidth,
    srcRow * imagePieceHeight,
    imagePieceWidth,
    imagePieceHeight,
    destX,
    destY,
    puzzleWidth,
    puzzleHeight
  );
  node.style.backgroundImage = `url(${canvas.toDataURL()})`;
  node.style.backgroundSize = `${canvas.width}px ${canvas.height}px`;
  node.style.backgroundPosition = `-${destX}px -${destY}px`;
}
function shuffleArray(array) {
  let newArr = array.flat();
  for (let i = newArr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}
function coordByValue(arr, value) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === value) {
        return { i, j };
      }
    }
  }
  return null;
}
function isValidForSwap(blankCoord, buttonCoord) {
  return (
    Math.abs(blankCoord.i - buttonCoord.i) +
      Math.abs(blankCoord.j - buttonCoord.j) ===
    1
  );
}
function swap(coord1, coord2, arr) {
  [arr[coord1.i][coord1.j], arr[coord2.i][coord2.j]] = [
    arr[coord2.i][coord2.j],
    arr[coord1.i][coord1.j],
  ];
}

function isVictory(matrix) {
  const arr = matrix.flat();
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] !== i + 1) {
      return false;
    }
  }
  victory = true;
  return victory;
}

function audioWithPath(path) {
  audio = new Audio();
  audio.src = path;
  audio.autoplay = true;
  return audio;
}

function createBtnAudio(audio) {
  let btnStopMusik = document.createElement("button");
  btnStopMusik.setAttribute("id", "pause");
  btnStopMusik.setAttribute("class", "button active");
  btnStopMusik.textContent = "Stop music";
  btnStopMusik.style.position = "absolute";
  btnStopMusik.style.bottom = 0;
  btnStopMusik.style.right = 0;
  document.body.appendChild(btnStopMusik);
  btnStopMusik.addEventListener("click", () => {
    btnStopMusik.classList.toggle("active");
    if (btnStopMusik.classList.contains("active")) {
      audio.play();
      btnStopMusik.textContent = "Stop music";
    } else {
      audio.pause();
      btnStopMusik.textContent = "Play music";
      btnStopMusik.style.display = "none";
    }
  });
}

function createInfo(name, score, time) {
  let info = document.createElement("div");
  info.setAttribute("id", "info");
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  info.innerHTML = `
    <p><span>Game over!</span></p>
    <p>Congratilations <span>${name}</span>!</p>
    <p>You have completed the picture in <span>${minutes}</span> minuten <span>${seconds}</span> secunden</p>
    <p>scored <span>${score}</span> points</p>
    `;
  info.style.fontSize = "1.3rem";
  info.style.fontWeight = "bold";
  info.style.color = "black";
  info.style.textAlign = "center";
  info.style.backgroundColor = "lightgreen";
  info.style.padding = "1rem";
  info.style.border = "2px solid black";
  info.style.borderRadius = "10px";
  info.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
  info.style.top = "0";
  info.style.right = "34.5%";
  info.style.zIndex = "10";
  info.style.position = "absolute";
  info.style.alignContent = "center";
  document.body.append(info);
  info.querySelectorAll("span").forEach((span) => {
    span.style.color = "red";
    span.style.fontSize = "2rem";
    span.style.fontWeight = "bold";
  });
  return info;
}
