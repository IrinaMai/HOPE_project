// генерує в випадкові послідовності картки (приймає кількість карток, масив карток та посилання куди вставити картки)
import level from "./level.js";

const drawCards = (amount, cards, containerRef) => {
   containerRef.querySelectorAll(".card").forEach((card) => card.remove());
   let collection = [];
   while (!(collection.length === amount)) {
      let random = Math.ceil(Math.random() * cards.length);
      if (!collection.includes(random)) {
         collection.push(random);
      }
      if (collection.length === amount / 2) {
         collection = [...collection, ...collection];
         let setOfCards = collection.slice();
         while (!(setOfCards.length === 0)) {
            random = Math.ceil(Math.random() * cards.length);
            if (setOfCards.includes(random)) {
               let card = cards.find((card) => card.id === random);
               let string = `<div class="card card-${card.id}">
  <picture>
    <source srcset="./img/card-down.webp" type="image/webp"><img
      data-id='${card.id}' src='./img/card-down.png' class="card__back">
  </picture>
  <picture>
    <source srcset="${card.webp}" type="image/webp">
    <img class="card__photo" src="${card.src}" alt="${card.description}" data-id='${card.id}'>
  </picture>
</div>`;
               // let string = `<div class="card card-${card.id}"><img data-id='${card.id}' src='./img/card-down.png' class="card__back" ><img class="card__photo" src="${card.src}" alt="${card.description}" data-id='${card.id}'></div>`;
               containerRef.insertAdjacentHTML("beforeend", string);
               setOfCards.splice(setOfCards.indexOf(random), 1);
            }
         }
      }
   }
};
// <source srcset="./img/Cansel-button@1X.webp" type="image/webp"><img src="./img/Cansel-button@1X.png" alt="close_btn" />
let gameResult;
const funcGlob = {};
// починає гру на заданому контейнері карток (контейнер карток, тип гри)
const gamePlay = (container, playerAmount, gameType, currentLevel) => {
   const state = {
      ref: "",
      id: 0,
      position: 1,
      gameState: 0,
      blocked: false,
      move: 0,
      count: [0, 0, 0, 0],
   };
   const correctRef = document.querySelector(".audio__correct");
   const flipRef = document.querySelector(".audio__flip");
   const removeCards = (event) => {
      event.target.parentNode.nextElementSibling.lastElementChild.classList.add("scaled");
      state.ref.parentNode.nextElementSibling.lastElementChild.classList.add("scaled");
      event.target.parentNode.parentNode.classList.add("hidden");
      state.ref.parentNode.parentNode.classList.add("hidden");
      state.blocked = false;
      setTimeout(() => {
         event.target.parentNode.nextElementSibling.lastElementChild.classList.remove("scaled");
         state.ref.parentNode.nextElementSibling.lastElementChild.classList.remove("scaled");
      }, 300);
   };
   const repairCard = (event) => {
      event.target.parentNode.nextElementSibling.lastElementChild.classList.remove("choosed");
      state.ref.parentNode.nextElementSibling.lastElementChild.classList.remove("choosed");
      event.target.classList.remove("flip");
      state.ref.classList.remove("flip");
      state.blocked = false;
   };
   const playerCount = [...document.querySelectorAll(".game__player-counter")];
   const playerMessage = document.querySelector(".game__player-turn");
   // починає гру при сингл плеєрі і аркаді
   funcGlob.compareCardSingle = () => {
      if (state.blocked || !event.target.classList.contains("card__back")) return;
      event.target.classList.add("flip");
      // flipRef.currentTime = 0;
      // flipRef.play();
      console.log(event.target);
      console.log(event.target.parentNode.nextElementSibling.lastElementChild);
      event.target.parentNode.nextElementSibling.lastElementChild.classList.add("choosed");
      if (state.position === 2) {
         if (state.ref === event.target) return;
         if (state.ref.dataset.id === event.target.dataset.id) {
            correctRef.play();
            state.position = 1;
            state.blocked = true;
            setTimeout(removeCards, 400, event);
            state.gameState++;
            if (state.gameState === container.children.length / 2) {
               state.gameState = 0;
               gameResult = "win";
               if (gameType === "arcade") {
                  const levelRef = +window.localStorage.getItem("level");
                  if (currentLevel !== 10) currentLevel === levelRef ? window.localStorage.setItem("level", levelRef + 1) : 1;

                  // window.localStorage.setItem("level", levelRef + 1);
                  const btnWrapper = document.querySelector(".arcade__btn-wrapper");
                  for (let i = 0; i < +window.localStorage.getItem("level"); i++) {
                     btnWrapper.children[i].classList.remove("arcade__btn--close");
                  }
                  document.querySelector(".win__headline-arcade").textContent = `You complete level ${currentLevel}`;
               }
               container.removeEventListener("click", funcGlob.compareCardSingle);
               setTimeout(endGame, 500, 1, container.children.length, gameType, currentLevel);
            }
         }
         if (state.ref.dataset.id !== event.target.dataset.id) {
            state.position = 1;
            state.blocked = true;
            setTimeout(repairCard, 1000, event);
         }
      } else if (state.position === 1) {
         state.ref = event.target;
         state.position = 2;
      }
   };

   // починає гру при мульти плеєрі
   funcGlob.compareCardMulti = () => {
      if (state.blocked || !event.target.classList.contains("card__back")) return;
      event.target.classList.add("flip");
      // flipRef.currentTime = 0;
      // flipRef.play();
      console.log(event.target);
      console.log(event.target.parentNode.nextElementSibling.lastElementChild);
      event.target.parentNode.nextElementSibling.lastElementChild.classList.add("choosed");
      if (state.position === 2) {
         if (state.ref === event.target) return;
         if (state.ref.dataset.id === event.target.dataset.id) {
            correctRef.play();
            state.position = 1;
            state.blocked = true;
            setTimeout(removeCards, 400, event);
            state.gameState++;
            playerCount[state.move].textContent++;
            state.count[state.move]++;
            if (state.gameState === container.children.length / 2) {
               state.gameState = 0;
               state.maxCount = 0;
               state.winner = [];
               setTimeout(() => {
                  const gameCounterRef = document.querySelectorAll(".game__player-counter");
                  for (let i = 0; i < playerAmount; i++) {
                     gameCounterRef[i].classList.add("hidden");
                  }
               }, 500);
               state.count.map((player) => (state.maxCount = state.maxCount < player ? player : state.maxCount));
               state.count.map((player, index) => (state.maxCount === player ? state.winner.push(index) : 1));
               let string = "Winner:";
               for (const player of state.winner) {
                  string = `${string} player-${player + 1}`;
               }
               document.querySelector(".win__headline").textContent = string;
               container.removeEventListener("click", funcGlob.compareCardMulti);
               playerCount[state.move].classList.add("game__player-counter--current");

               setTimeout(endGame, 500, 1, container.children.length, gameType);
            }
         } else {
            state.position = 1;
            state.blocked = true;
            playerCount[state.move].classList.remove("game__player-counter--current");
            state.move = state.move === playerAmount - 1 ? 0 : state.move + 1;
            playerCount[state.move].classList.add("game__player-counter--current");

            setTimeout(repairCard, 800, event);
            setTimeout(function () {
               playerMessage.classList.remove("hidden");
               playerMessage.textContent = `Player-${state.move + 1} move`;
            }, 600);
            setTimeout(function () {
               playerMessage.classList.add("hidden");
            }, 1500);
         }
      } else if (state.position === 1) {
         state.ref = event.target;
         state.position = 2;
      }
   };
   if (gameType === "singlePlayer" || gameType === "arcade") container.addEventListener("click", funcGlob.compareCardSingle);
   if (gameType === "multiPlayer") {
      container.addEventListener("click", funcGlob.compareCardMulti);
      playerCount[state.move].classList.add("game__player-counter--current");
      playerCount.forEach((count) => (count.textContent = 0));
   }
};

// розпочинає гру із заданими параметрами

export const startGame = (cardsAmount, cards, containerRef, timerCount, playerAmount, gameType, currentLevel) => {
   if (gameType === "arcade") cardsAmount = level[currentLevel - 1].cardsAmount;
   containerRef.classList.add(`card-container--${cardsAmount}`);
   document.querySelector(".game").classList.remove("hidden-modal");
   drawCards(cardsAmount, cards, containerRef);
   const numbersRef = document.querySelector(".game__start-number-wrapper");
   numbersRef.classList.remove("hidden-modal");
   const countdownRef = document.querySelector(".audio__countdown");
   document.querySelector(".audio__main-theme").pause();
   let index = 0;
   countdownRef.play();
   numbersRef.children[index].classList.remove("hidden-modal");
   numbersRef.children[index].classList.add("scaled-number");
   const startNumber = setInterval(() => {
      countdownRef.currentTime = 0;
      countdownRef.play();
      index++;
      numbersRef.children[index - 1].classList.add("hidden-modal");

      if (index === 4) {
         clearInterval(startNumber);
         numbersRef.classList.add("hidden-modal");
         numbersRef.children[index - 1].classList.add("hidden-modal");

         return;
      }
      setTimeout(() => numbersRef.children[index].classList.add("scaled-number"), 200);
      numbersRef.children[index].classList.remove("hidden-modal");
      numbersRef.children[index - 1].classList.remove("scaled-number");
   }, 1300);
   setTimeout(function () {
      countdownRef.pause();
      const gameCounterRef = [...document.querySelectorAll(".game__player-counter")];

      for (let i = 0; i < playerAmount; i++) {
         gameCounterRef[i].classList.remove("hidden");
      }
      const timerRef = document.querySelector(".timer");
      const minutesRef = document.querySelector(".timer__minutes");
      const secondsRef = document.querySelector(".timer__seconds");
      if (gameType === "arcade") {
         timerRef.classList.remove("hidden-modal");
         timer(level[currentLevel - 1].time, minutesRef, secondsRef, level[currentLevel - 1].cardsAmount);
      }
      if (gameType === "singlePlayer") {
         timerRef.classList.remove("hidden-modal");
         timer(timerCount, minutesRef, secondsRef, cardsAmount);
      }
      document.querySelector(".audio__game-play").currentTime = 0;
      document.querySelector(".audio__game-play").volume = 0.5;
      document.querySelector(".audio__game-play").play();

      gamePlay(containerRef, playerAmount, gameType, currentLevel);
   }, 5400); //7400
};

// закінчує гру
const endGame = (timerCount, cardsAmount, gameType, currentLevel) => {
   const containerRef = document.querySelector(".card-container");
   containerRef.removeEventListener("click", funcGlob.compareCardSingle);
   containerRef.classList.remove(`card-container--${cardsAmount}`);
   document.querySelector(".game").classList.add("hidden-modal");
   document.querySelector(".audio__game-play").pause();
   document.querySelector(".timer").classList.add("hidden-modal");
   if (timerCount + 1 === 0) {
      document.querySelector(".audio__lose").play();
      document.querySelector(".lose").classList.remove("hidden-modal");
      gameResult = "";
   } else {
      document.querySelector(".game__congratulation").classList.remove("hidden");
      document.querySelector(".audio__won").play();
      if (currentLevel === 10) {
         document.querySelector(".win__arcade").classList.remove("hidden-modal");
         return;
      }
      gameType === "arcade" ? document.querySelector(".arcade").classList.remove("hidden-modal") : document.querySelector(".win").classList.remove("hidden-modal");
   }
};
// таймер (кількість часу, посилання на хилини, секунди)
const timer = (timerCount, minutesRef, secondsRef, cardsAmount) => {
   let minutes = (timerCount / 60) % 60;
   let seconds = timerCount % 60 < 10 ? `0${timerCount % 60}` : timerCount % 60;
   if (gameResult === "win") {
      document.querySelector(".win__headline").textContent = `You won in ${timerCount} seconds`;
      gameResult = "";
      return;
   }
   if (timerCount < 0) {
      endGame(timerCount, cardsAmount);
   } else {
      timerCount--;
      minutesRef.innerHTML = Math.floor(minutes);
      secondsRef.innerHTML = seconds;
      setTimeout(timer, 1000, timerCount, minutesRef, secondsRef);
   }
};
