const gameOptions = {
  GAME_MODE: "equal", // equal or bigger
  PLAY_KEY_CODE: 32,
  END_KEY_CODE: 13,
  MIN_NUM: 1,
  MAX_NUM: 6,
  TARGET_NUM: 6,
  CUBE_ANIMATION_TIME: 1500,
};

const classes = {
  PLAYER: "player",
  BOARD: "board",
  THROW: "throw",
  CUBE: "cube",
  TOTAL_VALUE: "player__total-value",
  SERIES: "player__series-value",
};

let amountOfPlayers = 2;

class Player {
  totalValue = 0;
  nowSeries = [];

  constructor(playerNum, name) {
    this.displayPlayer(playerNum, name);
    this.playerEl = document.querySelector(`.${classes.PLAYER}--${playerNum}`);
    this.totalValueEl = this.playerEl.querySelector(`.${classes.TOTAL_VALUE}`);
    this.seriesEl = this.playerEl.querySelector(`.${classes.SERIES}`);
  }

  displayPlayer(playerNum, name) {
    let rightName = name ? name : `Игрок ${playerNum}`;

    let element = document.createElement("div");

    element.classList.add(classes.PLAYER);
    element.classList.add(`${classes.PLAYER}--${playerNum}`);
    element.innerHTML = `<h1 class="player__title">${rightName}</h1>
        <p class="player__total">
          Ваш счёт: <span class="player__total-value"></span>
        </p>

        <p class="player__series">
          Текущая серия: <span class="player__series-value"></span>
        </p>`;

    const boardEl = document.querySelector(`.${classes.BOARD}`);
    boardEl.append(element);
  }

  updateTotal() {
    this.totalValue += this.calculateValues();
    this.totalValueEl.textContent = this.totalValue;
    this.clearSeries();
  }

  updateSeries() {
    this.seriesEl.textContent = this.getSeries().join(", ");
  }

  getElement() {
    return this.playerEl;
  }

  setDefaultAll() {
    this.setDefaultTotalValue();
    this.setDefaultSeries();
  }

  setDefaultTotalValue() {
    this.totalValueEl.textContent = 0;
  }

  setDefaultSeries() {
    this.seriesEl.textContent = "";
  }

  addSeries(num) {
    this.nowSeries.push(num);
    this.updateSeries();
  }

  getSeries() {
    return this.nowSeries;
  }

  clearSeries() {
    this.nowSeries = [];
    this.setDefaultSeries();
  }

  calculateValues() {
    if (this.nowSeries.length != 0) {
      return this.nowSeries.reduce((acc, num) => {
        return acc + num;
      });
    } else {
      return 0;
    }
  }

  activatePlayer() {
    this.getElement().classList.add("active");
  }

  diactivatePlayer() {
    this.getElement().classList.remove("active");
  }

  getActivity() {
    return this.isActive;
  }
}

class Game {
  players = [];
  isFirstMove = true;
  isCanPlay = true;

  constructor() {
    this.boardEl = document.querySelector(`.${classes.BOARD}`);
    this.throwEl = document.querySelector(`.${classes.THROW}`);
    this.cube1Sides = document.querySelectorAll(`.${classes.CUBE}--1 .side`);
    this.cube2Sides = document.querySelectorAll(`.${classes.CUBE}--2 .side`);
  }

  addPlayer(player) {
    this.players.push(player);
  }

  start() {
    this.setActivePlayerOptions(0);

    this.players.forEach((player) => {
      player.setDefaultAll();
    });
  }

  play() {
    this.throwEl.classList.add("active");
    this.isCanPlay = false;

    switch (gameOptions.GAME_MODE){
      case ('bigger'): this.playAsBigger();
      case ('equal'): this.playAsEqual();
    }
  }

  playAsEqual(){
    let rndNum1 = this.getRandomNum();
    let rndNum2 = this.getRandomNum();

    //Первый ход безпроигрышный
    while (rndNum2 === rndNum1 && this.isFirstMove) {
      rndNum2 = this.getRandomNum();
    }

    let sum = rndNum1 + rndNum2;

    this.isFirstMove = false;

    setTimeout(() => {
      this.setTextInCube(this.cube1Sides, rndNum1);
      this.setTextInCube(this.cube2Sides, rndNum2);
    }, gameOptions.CUBE_ANIMATION_TIME / 2);

    setTimeout(() => {
      this.isCanPlay = true;
      if (rndNum1 === rndNum2) {
        this.lose();
      } else {
        this.activePlayer.addSeries(sum);
        this.throwEl.classList.remove("active");
      }
    }, gameOptions.CUBE_ANIMATION_TIME);
  }

  playAsBigger() {

    //Первый ход безпроигрышный
    let rndNum1 = this.isFirstMove
      ? this.getRandomNum(
          gameOptions.MIN_NUM,
          Math.min(gameOptions.TARGET_NUM - 2, gameOptions.MAX_NUM)
        )
      : this.getRandomNum();

    let rndNum2 = this.isFirstMove
      ? this.getRandomNum(
          gameOptions.MIN_NUM,
          Math.min(gameOptions.TARGET_NUM - rndNum1 - 1, gameOptions.MAX_NUM)
        )
      : this.getRandomNum();

    this.isFirstMove = false;

    let sum = rndNum1 + rndNum2;

    setTimeout(() => {
      this.setTextInCube(this.cube1Sides, rndNum1);
      this.setTextInCube(this.cube2Sides, rndNum2);
    }, gameOptions.CUBE_ANIMATION_TIME / 2);

    setTimeout(() => {
      this.isCanPlay = true;
      if (sum >= gameOptions.TARGET_NUM) {
        this.lose();
      } else {
        this.activePlayer.addSeries(sum);
        this.throwEl.classList.remove("active");
      }
    }, gameOptions.CUBE_ANIMATION_TIME);
  }

  lose() {
    this.activePlayer.clearSeries();
    this.changeActivePlayer();
    this.throwEl.classList.remove("active");
  }

  end() {
    this.activePlayer.updateTotal();
    this.changeActivePlayer();
    this.throwEl.classList.remove("active");
  }

  changeActivePlayer() {
    this.activePlayer.diactivatePlayer();
    this.isFirstMove = true;

    let nowActiveInd =
      this.activePlayerInd < this.players.length - 1
        ? this.activePlayerInd + 1
        : 0;

    this.setActivePlayerOptions(nowActiveInd);
  }

  setActivePlayerOptions(ind) {
    this.activePlayerInd = ind;
    this.activePlayer = this.players[ind];
    this.activePlayer.activatePlayer();
  }

  setTextInCube(sides, text) {
    sides.forEach((side) => {
      side.textContent = text;
    });
  }

  getRandomNum(min = gameOptions.MIN_NUM, max = gameOptions.MAX_NUM) {
    return Math.round(Math.random() * (max - min) + min);
  }

  getCanPlay() {
    return this.isCanPlay;
  }
}

const amountPlayersBtns = document.querySelector(
  ".amount-players__player-btns"
);
const screens = document.querySelectorAll(".screen");

const selectNameBox = document.querySelector(".select-name__box");
const selectNameBtn = document.querySelector(".select-name__btn");

//первый экран
amountPlayersBtns.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("amount-players__players-btn")) {
    amountOfPlayers = +evt.target.dataset.value;
    screens[0].classList.add("hide");
    createSelectNameItems(amountOfPlayers);
  }
});

function createSelectNameItems(n = 1) {
  for (let i = 1; i <= n; i++) {
    selectNameBox.append(createSelectNameItem(i));
  }
}

function createSelectNameItem(i = 1) {
  const element = document.createElement("div");
  element.classList.add("select-name__item");
  element.innerHTML = `
            <h3 class="select-name__item-title">
              Игрок ${i}
            </h3>
            <input class="select-name__item-input" data-index="${i}" type="text" placeholder="Ваше имя" value="">`;
  return element;
}

//второй экран
let game;

selectNameBtn.addEventListener("click", (evt) => {
  game = new Game();
  const selectNameItems = document.querySelectorAll(".select-name__item");

  selectNameItems.forEach((item) => {
    const input = item.querySelector(".select-name__item-input");
    game.addPlayer(new Player(+input.dataset.index, input.value));
  });

  screens[1].classList.add("hide");

  game.start();
});

//экран с игрой
document.addEventListener("keydown", (evt) => {
  if (evt.keyCode === gameOptions.PLAY_KEY_CODE) {
    evt.preventDefault();
    if (game.getCanPlay()) {
      game.play();
    }
  } else if (evt.keyCode === gameOptions.END_KEY_CODE) {
    evt.preventDefault();
    if (game.getCanPlay()) {
      game.end();
    }
  }
});
