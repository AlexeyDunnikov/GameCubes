import { Game } from './game.js';
import { Player } from './player.js';
import {gameOptions} from './constants.js';

let amountOfPlayers = 2;

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
