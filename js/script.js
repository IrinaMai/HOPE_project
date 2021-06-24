import cards from "./cards.js";
import { startGame } from "./functions.js";
import { returnToMenu } from "./functions.js";
import { validLanguage } from "./functions.js";

const refs = {};
refs.containerRef = document.querySelector(".card-container");
refs.settingsRef = document.querySelector(".settings");
refs.cardsAmount = 12;
refs.timerCount = 60;
refs.playerAmount = 0;
refs.gameType = "singlePlayer";
refs.currentLevel = 1;
window.localStorage.setItem("level", window.localStorage.getItem("level") || 1);
window.localStorage.setItem("volume", window.localStorage.getItem("volume") || 1);
window.localStorage.setItem("bg", window.localStorage.getItem("bg") || 1);
window.localStorage.setItem("language", window.localStorage.getItem("language") || "gb");
refs.lang = window.localStorage.getItem("language");
refs.volume = +window.localStorage.getItem("volume");
refs.bgVideo = document.querySelector("#video--js");
document.querySelector(".main").style.backgroundImage = `url(./img/bg${localStorage.getItem("bg")}.jpg)`;
// document.addEventListener("DOMContentLoaded", () => {
//    document.querySelector(".logo_team").classList.add("logo_game--apearLogoTeam");
//    document.querySelector(".logo_game").classList.add("logo_game--apearTitleGame");
//    console.log("DOM loaded");
// });
window.addEventListener("DOMContentLoaded", () => {
   setTimeout(() => {
      document.querySelector(".logo_team").classList.add("logo_game--apearLogoTeam");
      document.querySelector(".logo_game").classList.add("logo_game--apearTitleGame");
      console.log(refs.bgVideo);
      refs.bgVideo.play();
      console.log("DOM loaded");
   }, 400);
});
// function checkBuffer(videoRef) {
//    console.log(videoRef.buffered.start(0));
//    console.log(videoRef.buffered.end(0));
//    if (videoRef.buffered.end(0) > 4) {
//       console.log(videoRef.buffered.end(0));
//       document.querySelector(".logo_game").classList.add("logo_game--apearTitleGame");
//       document.querySelector(".logo_team").classList.add("logo_game--apearLogoTeam");
//       videoRef.play();
//       clearInterval(bufferInterval);
//    }
// }
// console.log(refs.bgVideo.firstElementChild.buffered.end(0));

document.querySelector(".start__btn").addEventListener("click", () => {
   document.querySelector(".settings").classList.remove("hidden-modal");
   document.querySelector(".start").classList.add("hidden-modal");
   document.querySelector(".audio__main-theme").play();
   refs.bgVideo.classList.add("hidden-modal");
   document.querySelectorAll(".logo").forEach((item) => item.classList.add("hidden-modal"));
   setTimeout(() => (refs.bgVideo.style.display = "none"), 500);
});
const keyCloseModal = (event) => {
   if (event.code === "Escape") {
      document.querySelector(".backdrop_authors_modal").classList.add("hidden-modal");
      window.removeEventListener("keydown", keyCloseModal);
   }
};

const keyCloseModal2 = (event) => {
   if (event.code === "Escape") {
      document.querySelector(".backdrop_how-to-play_modal").classList.add("hidden-modal");
      window.removeEventListener("keydown", keyCloseModal2);
   }
};

const keyCloseModal3 = (event) => {
   if (event.code === "Escape") {
      document.querySelector(".backdrop_settings_modal").classList.add("hidden-modal");
      window.removeEventListener("keydown", keyCloseModal3);
   }
};

const backDropCloseModal = (event) => {
   if (event.target === event.currentTarget) {
      event.currentTarget.classList.add("hidden-modal");
   }
};

document.querySelectorAll(".settings_btn--js").forEach((btn) =>
   btn.addEventListener("click", () => {
      if (!document.querySelector(".start").classList.contains("hidden-modal")) document.querySelector(".audio__main-theme").play();
      window.addEventListener("keydown", keyCloseModal3);
      document.querySelector(".backdrop_settings_modal").classList.remove("hidden-modal");
   })
);

document.querySelector(".backdrop_settings_modal").addEventListener("click", backDropCloseModal);

document.querySelector(".settings-modal__close-btn").addEventListener("click", (event) => {
   window.removeEventListener("keydown", keyCloseModal3);
   event.currentTarget.parentNode.parentNode.classList.add("hidden-modal");
});

document.querySelectorAll(".start__how-to-play--js").forEach((btn) =>
   btn.addEventListener("click", () => {
      document.querySelector(".backdrop_how-to-play_modal").classList.remove("hidden-modal");
      window.addEventListener("keydown", keyCloseModal2);
      if (!document.querySelector(".start").classList.contains("hidden-modal")) document.querySelector(".audio__main-theme").play();
   })
);
document.querySelectorAll(".start__author--js").forEach((btn) =>
   btn.addEventListener("click", () => {
      document.querySelector(".backdrop_authors_modal").classList.remove("hidden-modal");
      window.addEventListener("keydown", keyCloseModal);
      document.querySelector(".audio__main-theme").play();
   })
);

document.querySelector(".backdrop_authors_modal").addEventListener("click", backDropCloseModal);

document.querySelector(".backdrop_how-to-play_modal").addEventListener("click", backDropCloseModal);

document.querySelector(".start__how-to-play").addEventListener("click", (event) => {
   document.querySelector(".how-to-play").classList.remove("hidden-modal");
   document.querySelector(".audio__main-theme").play();
});
document.querySelector(".start__author").addEventListener("click", (event) => {
   document.querySelector(".authors-modal").classList.remove("hidden-modal");
   document.querySelector(".audio__main-theme").play();
});

document.querySelectorAll(".settings__type").forEach((type) => {
   type.addEventListener("click", (event) => {
      refs.gameType = event.target.dataset.type;
      document.querySelectorAll(".settings__by-type").forEach((settings) => settings.classList.add("hidden-modal"));
      document.querySelector(`.settings__${event.currentTarget.dataset.type}`).classList.remove("hidden-modal");
      document.querySelector(".settings__type--active").classList.remove("settings__type--active");
      event.currentTarget.classList.add("settings__type--active");
      if (event.target.dataset.type === "singlePlayer") {
         refs.playerAmount = 0;
         refs.cardsAmount = +[...document.querySelectorAll(".count-cards__wrapper")[0].children].find((btn) => btn.classList.contains("settings__btn--choosed")).dataset.count;
      }
      if (event.target.dataset.type === "multiPlayer") {
         refs.cardsAmount = +[...document.querySelectorAll(".count-cards__wrapper")[1].children].find((btn) => btn.classList.contains("settings__btn--choosed")).dataset.count;
         refs.playerAmount = [...document.querySelector(".count-player__wrapper").children].find((btn) => btn.classList.contains("settings__btn--choosed")).dataset.count;
      }
      if (event.currentTarget.dataset.type === "arcade") {
         refs.playerAmount = 0;
         refs.level = +window.localStorage.getItem("level");
         const btnWrapper = document.querySelector(".arcade__btn-wrapper");
         for (let i = 0; i < refs.level; i++) {
            btnWrapper.children[i].classList.remove("arcade__btn--close");
         }
      }
   });
});
document.querySelectorAll(".count-cards__wrapper").forEach((container) => {
   container.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) return;
      refs.cardsAmount = +event.target.dataset.count;
      event.target.parentNode.querySelector(".settings__btn--choosed").classList.remove("settings__btn--choosed");
      event.target.classList.add("settings__btn--choosed");
   });
});
document.querySelector(".count-timer__wrapper").addEventListener("click", (event) => {
   if (event.target === event.currentTarget) return;
   refs.timerCount = +event.target.dataset.count;
   event.target.parentNode.querySelector(".settings__btn--choosed").classList.remove("settings__btn--choosed");
   event.target.classList.add("settings__btn--choosed");
});
document.querySelector(".count-player__wrapper").addEventListener("click", (event) => {
   if (event.target === event.currentTarget) return;
   refs.playerAmount = +event.target.dataset.count;
   event.target.parentNode.querySelector(".settings__btn--choosed").classList.remove("settings__btn--choosed");
   event.target.classList.add("settings__btn--choosed");
});
document.querySelector(".arcade__btn-wrapper").addEventListener("click", (event) => {
   if (event.target === event.currentTarget || event.target.classList.contains("arcade__btn--close")) return;
   refs.currentLevel = +event.target.textContent;
   event.target.parentNode.querySelector(".settings__btn--choosed").classList.remove("settings__btn--choosed");
   event.target.classList.add("settings__btn--choosed");
});
document.querySelectorAll(".win__open-menu").forEach((btn) => {
   btn.addEventListener("click", () => {
      document.querySelectorAll(".win__gif").forEach((gifRef) => (gifRef.innerHTML = ""));
      document.querySelector(".settings_btn--js").classList.remove("hidden");
      document.querySelector(".settings").classList.remove("hidden-modal");
      document.querySelector(".game__congratulation").classList.add("hidden");
      document.querySelector(".audio__main-theme").currentTime = 0;
      document.querySelector(".audio__main-theme").play();
      btn.parentNode.parentNode.parentNode.classList.add("hidden-modal");
      document.querySelector(".audio__arcade_total_win").pause();
   });
});
document.querySelector(".win__next-level").addEventListener("click", (event) => {
   refs.currentLevel++;
   startGame(refs.cardsAmount, cards, refs.containerRef, refs.timerCount, refs.playerAmount, refs.gameType, refs.currentLevel);
   document.querySelectorAll(".win__gif").forEach((gifRef) => (gifRef.innerHTML = ""));

   document.querySelector(".game__congratulation").classList.add("hidden");
   event.currentTarget.parentNode.parentNode.parentNode.classList.add("hidden-modal");
});
document.querySelectorAll(".win__replay").forEach((btn) =>
   btn.addEventListener("click", () => {
      document.querySelectorAll(".win__gif").forEach((gifRef) => (gifRef.innerHTML = ""));
      startGame(refs.cardsAmount, cards, refs.containerRef, refs.timerCount, refs.playerAmount, refs.gameType, refs.currentLevel);
      btn.parentNode.parentNode.parentNode.classList.add("hidden-modal");
      document.querySelector(".game__congratulation").classList.add("hidden");
      document.querySelector(".audio__arcade_total_win").pause();
   })
);
document.querySelector(".settings__start-btn").addEventListener("click", function () {
   startGame(refs.cardsAmount, cards, refs.containerRef, refs.timerCount, refs.playerAmount, refs.gameType, refs.currentLevel);
   refs.settingsRef.classList.add("hidden-modal");
   document.querySelector(".settings_btn--js").classList.add("hidden");
});
document.querySelectorAll(".close-modal-btn").forEach((btn) => {
   btn.addEventListener("click", (event) => {
      window.removeEventListener("keydown", keyCloseModal);
      window.removeEventListener("keydown", keyCloseModal2);
      document.getElementById(event.currentTarget.dataset.modal).classList.add("hidden-modal");
   });
});
document.querySelector(".settings-modal__audio-range").value = refs.volume * 20;
if (refs.volume === 0) {
   document.querySelector("#mute").classList.remove("hidden-modal");
   document.querySelector("#high").classList.add("hidden-modal");
}
document.querySelector(".settings-modal__background-wrapper").children[+window.localStorage.getItem("bg") - 1].classList.add("settings-modal__background--active");
[...document.querySelector(".audio").children].forEach((audio) => (audio.volume = +audio.dataset.volume * refs.volume));
document.querySelector(".settings-modal__audio-range").addEventListener("input", (event) => {
   window.localStorage.setItem("volume", event.target.value / 20);
   if (+event.target.value === 0) {
      event.target.parentNode.querySelector("#mute").classList.remove("hidden-modal");
      event.target.parentNode.querySelector("#high").classList.add("hidden-modal");
   } else {
      event.target.parentNode.querySelector("#high").classList.remove("hidden-modal");
      event.target.parentNode.querySelector("#mute").classList.add("hidden-modal");
   }
   [...document.querySelector(".audio").children].forEach((audio) => (audio.volume = (+audio.dataset.volume * event.target.value) / 20));
});
document.querySelector(".settings-modal__background-wrapper").addEventListener("click", (event) => {
   if (event.target === event.currentTarget) return;
   window.localStorage.setItem("bg", event.target.dataset.bg);
   event.target.parentNode.querySelector(".settings-modal__background--active").classList.remove("settings-modal__background--active");
   event.target.classList.add("settings-modal__background--active");
   document.querySelector(".main").style.backgroundImage = `url(./img/bg${event.target.dataset.bg}.jpg)`;
});
document.querySelector(".settings-modal__flags-wrapper").addEventListener("click", (event) => {
   if (!event.target.dataset.lang) return;
   window.localStorage.setItem("language", event.target.dataset.lang);
   event.target.parentNode.querySelector(".settings-modal__flags-btn--active").classList.remove("settings-modal__flags-btn--active");
   event.target.classList.add("settings-modal__flags-btn--active");
});
validLanguage();
[...document.querySelector(".settings-modal__flags-wrapper").children].find((lang) => lang.dataset.lang === refs.lang).classList.add("settings-modal__flags-btn--active");
document.querySelector(".settings-modal__flags-wrapper").addEventListener("click", (event) => {
   if (!event.target.dataset.lang) return;
   event.target.parentNode.querySelector(".settings-modal__flags-btn--active").classList.remove("settings-modal__flags-btn--active");
   event.target.classList.add("settings-modal__flags-btn--active");
   window.localStorage.setItem("language", event.target.dataset.lang);
   validLanguage();
});
// pause -----------------------------------------------------------
const pauseBtnRef = document.querySelector(".game__pause");
const pauseModalRef = document.querySelector(".pause");
const pauseCloseBtnRef = document.querySelector(".pause-modal__close-btn");

pauseCloseBtnRef.addEventListener("click", () => {
   pauseModalRef.classList.add("hidden-modal");
});

// window.addEventListener("keydown", (event) => {
//    if (event.code === "Space") {
//       pauseModalRef.classList.remove("hidden-modal");
//    }
// });

// window.addEventListener("keydown", (event) => {
//    if (event.code === "Escape") {
//       pauseModalRef.classList.add("hidden-modal");
//    }
// });

pauseBtnRef.addEventListener("click", () => {
   pauseModalRef.classList.remove("hidden-modal");
});
//----------------------------------------------------------------
document.querySelector(".pause__resume").addEventListener("click", (event) => event.currentTarget.parentNode.parentNode.classList.add("hidden-modal"));
document.querySelector(".pause__back-to-menu").addEventListener("click", returnToMenu);
document.querySelector(".arcade__video").style.display = "none";
