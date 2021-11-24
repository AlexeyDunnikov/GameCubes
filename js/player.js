import { gameOptions, classes } from "./constants.js";

export class Player {
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
