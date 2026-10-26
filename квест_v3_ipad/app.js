// ============================================================
// Логика квеста по ИПУ РАН
// Вопросы — в data/questions.js (window.QUESTIONS)
// ============================================================

(function () {
  "use strict";

  const allQuestions = window.QUESTIONS || [];
  const QUESTIONS_PER_GAME = 10;

  const screenStart = document.getElementById("screen-start");
  const screenQuiz = document.getElementById("screen-quiz");
  const screenResult = document.getElementById("screen-result");
  const btnStart = document.getElementById("btn-start");
  const btnAgain = document.getElementById("btn-again");
  const btnToStart = document.getElementById("btn-to-start");
  const btnNext = document.getElementById("btn-next");

  const progressText = document.getElementById("progress-text");
  const progressFill = document.getElementById("progress-fill");
  const qText = document.getElementById("q-text");
  const optionsBox = document.getElementById("options");
  const feedback = document.getElementById("feedback");
  const feedbackTitle = document.getElementById("feedback-title");
  const feedbackText = document.getElementById("feedback-text");

  const resultEmoji = document.getElementById("result-emoji");
  const resultTitle = document.getElementById("result-title");
  const resultScore = document.getElementById("result-score");
  const prizeItem = document.getElementById("prize-item");
  const prizeNote = document.getElementById("prize-note");

  let picked = [];
  let current = 0;
  let score = 0;
  let answered = false;

  // ---- Призы (от слабого к сильному) ----
  const PRIZES = [
    { emoji: "🧟", name: "Мумия", note: "Потому что квесты — это страшно! Годится и для Хэллоуина." },
    { emoji: "🍾", name: "Открывашка", note: "Открывается легко — как и вход в науку!" },
    { emoji: "📱", name: "Подставка для телефона", note: "Телефон всегда на месте — как и твои ответы." }
  ];

  function show(screen) {
    [screenStart, screenQuiz, screenResult].forEach(s => s.classList.add("hidden"));
    screen.classList.remove("hidden");
    window.scrollTo({ top: 0 });
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  const NOT_IPU_PER_GAME = 2;

  function isNotIpu(q) {
    return q.notIpu === true;
  }

  function pickQuestions() {
    const notIpu = allQuestions.filter(isNotIpu);
    const picked = shuffle(notIpu).slice(0, Math.min(NOT_IPU_PER_GAME, notIpu.length));
    const rest = allQuestions.filter(function (q) {
      return !isNotIpu(q);
    });
    return picked.concat(shuffle(rest).slice(0, QUESTIONS_PER_GAME - picked.length));
  }

  function startGame() {
    picked = pickQuestions();
    current = 0;
    score = 0;
    answered = false;
    show(screenQuiz);
    renderQuestion();
  }

  function renderQuestion() {
    const q = picked[current];
    answered = false;

    progressText.textContent = "Вопрос " + (current + 1) + " из " + QUESTIONS_PER_GAME;
    progressFill.style.width = ((current / QUESTIONS_PER_GAME) * 100) + "%";

    qText.textContent = q.q;

    optionsBox.innerHTML = "";
    q.options.forEach(function (opt, idx) {
      const btn = document.createElement("button");
      btn.className = "option";
      btn.type = "button";
      btn.textContent = opt;
      btn.dataset.idx = String(idx);
      btn.addEventListener("click", function () {
        chooseAnswer(idx, btn);
      });
      optionsBox.appendChild(btn);
    });

    feedback.classList.add("hidden");
    feedback.classList.remove("correct", "wrong");
  }

  function chooseAnswer(idx, btn) {
    if (answered) return;
    answered = true;

    const q = picked[current];
    const buttons = optionsBox.querySelectorAll(".option");
    buttons.forEach(function (b) {
      b.classList.add("disabled");
    });

    const ok = idx === q.correct;
    btn.classList.add(ok ? "correct" : "wrong");
    if (!ok && buttons[q.correct]) {
      buttons[q.correct].classList.add("correct");
    }

    if (ok) score += 1;

    feedback.classList.remove("hidden");
    feedback.classList.add(ok ? "correct" : "wrong");
    feedbackTitle.textContent = ok ? "✅ Верно!" : "❌ Неверно";
    feedbackText.textContent = q.explain || "";
  }

  function nextQuestion() {
    current += 1;
    if (current < picked.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    const total = picked.length;
    resultScore.textContent = "Ты ответил правильно на " + score + " из " + total;

    let title, emoji, prize;
    if (score >= 8) {
      title = "Ты — легенда ИПУ!";
      emoji = "🏆";
      prize = PRIZES[2];
    } else if (score >= 5) {
      title = "Отличный результат!";
      emoji = "🎓";
      prize = PRIZES[1];
    } else {
      title = "Шляпа удивлена...";
      emoji = "🧟";
      prize = PRIZES[0];
    }

    resultTitle.textContent = title;
    resultEmoji.textContent = emoji;
    prizeItem.textContent = prize.emoji + " " + prize.name;
    prizeNote.textContent = prize.note;

    show(screenResult);
  }

  btnStart.addEventListener("click", startGame);
  btnNext.addEventListener("click", nextQuestion);
  btnAgain.addEventListener("click", startGame);
  btnToStart.addEventListener("click", function () {
    show(screenStart);
  });

  // Звёзды
  const starsBox = document.getElementById("stars");
  if (starsBox) {
    for (let i = 0; i < 70; i += 1) {
      const s = document.createElement("div");
      s.className = "star";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.animationDelay = (Math.random() * 4).toFixed(2) + "s";
      s.style.animationDuration = (2.2 + Math.random() * 3).toFixed(2) + "s";
      starsBox.appendChild(s);
    }
  }

  // Статистика
  const statCount = document.getElementById("stat-count");
  if (statCount) statCount.textContent = String(allQuestions.length);
})();