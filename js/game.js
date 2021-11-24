import { gameOptions, classes } from "./constants.js";

export class Game {
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

    switch (gameOptions.GAME_MODE) {
      case "bigger":
        this.playAsBigger();
      case "equal":
        this.playAsEqual();
    }
  }

  playAsEqual() {
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
