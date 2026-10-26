// ============================================================
// Логика «Распределяющая шляпа v2»
// Данные лабораторий — в data/labs.js (window.IPU_LABS_V2)
// ============================================================

(function () {
  "use strict";

  const labs = window.IPU_LABS_V2 || [];

  const screenStart = document.getElementById("screen-start");
  const screenLoading = document.getElementById("screen-loading");
  const screenResult = document.getElementById("screen-result");
  const btnStart = document.getElementById("btn-start");
  const btnAgain = document.getElementById("btn-again");
  const loadingText = document.getElementById("loading-text");
  const loaderFill = document.getElementById("loader-fill");

  const resEmojis = document.getElementById("res-emojis");
  const resName = document.getElementById("res-name");
  const resJoke = document.getElementById("res-joke");
  const resRole = document.getElementById("res-role");
  const resLeader = document.getElementById("res-leader");
  const resDegree = document.getElementById("res-degree");
  const resPhoto = document.getElementById("res-photo");
  const resPhotoFallback = document.getElementById("res-photo-fallback");
  const resDescription = document.getElementById("res-description");
  const resDirections = document.getElementById("res-directions");
  const resList = document.getElementById("res-list");
  const resFacts = document.getElementById("res-facts");
  const resSkills = document.getElementById("res-skills");
  const resLink = document.getElementById("res-link");

  const LOADING_PHRASES = [
    "Шляпа думает...",
    "Колдует над списком лабораторий...",
    "Подбирает идеальное направление...",
    "Гадает по формулам...",
    "Почти решила..."
  ];
  const LOADING_STEP = 800;

  function show(screen) {
    [screenStart, screenLoading, screenResult].forEach(s => s.classList.add("hidden"));
    screen.classList.remove("hidden");
    window.scrollTo({ top: 0 });
  }

  function randomLab() {
    return labs[Math.floor(Math.random() * labs.length)];
  }

  function fillChips(container, items) {
    container.innerHTML = "";
    (items || []).forEach(function (item) {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = item;
      container.appendChild(chip);
    });
  }

  function renderResult(lab) {
    const photo = lab.leader && lab.leader.photo;
    const name = lab.leader ? lab.leader.name : "—";

    resEmojis.textContent = (lab.emoji || "🎩") + " " + lab.emoji + " " + lab.emoji;
    resName.textContent = lab.name || "Лаборатория ИПУ РАН";

    resRole.textContent = lab.role || "Магическая лаборатория";
    resLeader.textContent = name;
    resDegree.textContent = (lab.leader && lab.leader.degree) || "";

    if (photo) {
      resPhoto.src = photo;
      resPhoto.style.display = "block";
      resPhotoFallback.style.display = "none";
    } else {
      resPhoto.removeAttribute("src");
      resPhoto.style.display = "none";
      resPhotoFallback.style.display = "flex";
    }

    resJoke.textContent = lab.joke || "";
    resDescription.textContent = lab.description || "";

    fillChips(resDirections, lab.directions);
    fillChips(resSkills, lab.skills);

    resList.innerHTML = "";
    (lab.what || []).forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = item;
      resList.appendChild(li);
    });

    resFacts.innerHTML = "";
    (lab.facts || []).forEach(function (fact) {
      const div = document.createElement("div");
      div.className = "fact";
      div.textContent = fact;
      resFacts.appendChild(div);
    });

    resLink.href = lab.url || "https://www.ipu.ru/";
    resLink.textContent = "Подробнее на ipu.ru";
  }

  function startDistribution() {
    if (!labs.length) {
      alert("Не найдены данные о лабораториях. Проверьте data/labs.js");
      return;
    }

    btnStart.disabled = true;
    show(screenLoading);

    let step = 0;
    loadingText.textContent = LOADING_PHRASES[step];
    loaderFill.style.width = "10%";

    const interval = setInterval(() => {
      step += 1;
      loaderFill.style.width = Math.min(10 + step * 20, 95) + "%";
      if (step < LOADING_PHRASES.length) {
        loadingText.textContent = LOADING_PHRASES[step];
      } else {
        clearInterval(interval);
        loaderFill.style.width = "100%";

        const lab = randomLab();
        renderResult(lab);
        setTimeout(function () {
          show(screenResult);
          btnStart.disabled = false;
        }, 320);
      }
    }, LOADING_STEP);
  }

  btnStart.addEventListener("click", startDistribution);

  btnAgain.addEventListener("click", function () {
    show(screenStart);
  });

  document.querySelector(".hat-wrap").addEventListener("click", function () {
    if (!btnStart.disabled) {
      btnStart.click();
    }
  });

  // ---- Статистика на первой странице ----
  const statLabs = document.getElementById("stat-labs");
  if (statLabs) statLabs.textContent = String(labs.length);

  // ---- Звёздное небо ----
  const starsBox = document.getElementById("stars");
  if (starsBox) {
    const N = 90;
    for (let i = 0; i < N; i += 1) {
      const s = document.createElement("div");
      s.className = "star";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.animationDelay = (Math.random() * 4).toFixed(2) + "s";
      s.style.animationDuration = (2.2 + Math.random() * 3).toFixed(2) + "s";
      const size = 2 + Math.random() * 4;
      s.style.width = size + "px";
      s.style.height = size + "px";
      starsBox.appendChild(s);
    }
  }

  // ---- Конфетти при появлении результата ----
  function confettiBurst() {
    const colors = ["#e02f3f", "#ffd76a", "#b489b8", "#ff7180", "#8a5f8e", "#fff"];
    for (let i = 0; i < 26; i += 1) {
      const p = document.createElement("div");
      p.className = "confetti";
      p.style.left = Math.random() * 100 + "vw";
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = (Math.random() * 0.4).toFixed(2) + "s";
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 3200);
    }
  }

  // конфетти на старте (добавит феерии при открытии)
  setTimeout(confettiBurst, 800);

  // конфетти при каждом распределении
  const origShow = show;
  show = function (screen) {
    origShow(screen);
    if (screen === screenResult) {
      confettiBurst();
    }
  };

  // переопределим обработчик, чтобы конфетти срабатывало и при кнопке «ещё раз»
  const origRender = renderResult;
  renderResult = function (lab) {
    origRender(lab);
  };

  // Показываем текущий номер лаборатории в заголовке как бонус
  window.__ipu_lab_count = labs.length;
})();