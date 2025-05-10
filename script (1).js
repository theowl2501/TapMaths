let userProgress = {
  level: 1,
  experience: 0,
  gamesPlayed: 0
};

document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  const menuItems = document.querySelectorAll('.menu-item');
  updateProgressDisplay();
  setupDailyChallenge();

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const gameType = item.dataset.game;
      startGame(gameType);
    });
  });
});

function setupDailyChallenge() {
  const dailyChallenge = document.querySelector('.daily-challenge');
  const operations = ['sumas', 'restas', 'multiplicaciones', 'divisiones'];
  const gameType = operations[Math.floor(Math.random() * operations.length)];

  let num1, num2, correctAnswer, operation;

  switch (gameType) {
    case 'sumas':
      num1 = generateRandomNumber(50, 200);
      num2 = generateRandomNumber(50, 200);
      operation = `${num1} + ${num2}`;
      correctAnswer = num1 + num2;
      break;
    case 'restas':
      num1 = generateRandomNumber(100, 300);
      num2 = generateRandomNumber(50, num1);
      operation = `${num1} - ${num2}`;
      correctAnswer = num1 - num2;
      break;
    case 'multiplicaciones':
      num1 = generateRandomNumber(12, 20);
      num2 = generateRandomNumber(12, 20);
      operation = `${num1} × ${num2}`;
      correctAnswer = num1 * num2;
      break;
    case 'divisiones':
      num2 = generateRandomNumber(2, 12);
      correctAnswer = generateRandomNumber(12, 20);
      num1 = num2 * correctAnswer;
      operation = `${num1} ÷ ${num2}`;
      break;
  }

  dailyChallenge.innerHTML = `
    <h2>Daily Challenge</h2>
    <p>${operation}</p>
    <input type="number" id="daily-answer" placeholder="Your answer">
    <button id="check-daily">Check</button>
  `;

  document.getElementById('check-daily').onclick = () => {
    const userAnswer = parseInt(document.getElementById('daily-answer').value);
    if (userAnswer === correctAnswer) {
      dailyChallenge.innerHTML = `
        <h2>Daily Challenge</h2>
        <p>¡Correct! +20 points</p>
      `;
      userProgress.experience += 20;
      localStorage.setItem('userProgress', JSON.stringify(userProgress));
      updateProgressDisplay();
    } else {
      dailyChallenge.innerHTML = `
        <h2>Daily Challenge</h2>
        <p>Incorrect. The answer was ${correctAnswer}</p>
      `;
    }
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
}

function updateProgressDisplay() {
  const level = Math.floor(userProgress.experience / 100) + 1;
  const progressSection = document.querySelector('.progress-section');
  progressSection.innerHTML = `
    <h3>Your Progress</h3>
    <p class="level">Level ${level} - ${getLevelTitle(level)}</p>
    <div class="stats">
      <p>✨ ${userProgress.experience} EXP</p>
      <p>🎮 ${userProgress.gamesPlayed} Games</p>
    </div>
  `;
}

function getLevelTitle(level) {
  const titles = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
  return titles[Math.min(level - 1, titles.length - 1)];
}

function updateProgress(score) {
  userProgress.experience += score;
  userProgress.gamesPlayed++;
  localStorage.setItem('userProgress', JSON.stringify(userProgress));
  updateProgressDisplay();
}

function loadProgress() {
  const saved = localStorage.getItem('userProgress');
  if (saved) {
    userProgress = JSON.parse(saved);
  }
}

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createGameInterface(gameType) {
  const container = document.querySelector('.container');
  const baseHTML = `
    <div class="game-interface">
      <div class="score">Points: <span id="score">0</span></div>
      <div id="game-area"></div>
      <button id="exit">End game</button>
    </div>
  `;
  container.innerHTML = baseHTML;

  if (['sumas', 'restas', 'multiplicaciones', 'divisiones'].includes(gameType)) {
    document.getElementById('game-area').innerHTML = `
      <div class="operation" id="operation"></div>
      <input type="number" id="answer" placeholder="Your answer">
      <button id="submit">Check</button>
    `;
  }
}

function showGameOver(score) {
  // Actualizamos el progreso
  const oldExperience = userProgress.experience;
  userProgress.experience += score;
  userProgress.gamesPlayed++;
  localStorage.setItem('userProgress', JSON.stringify(userProgress));

  const level = Math.floor(userProgress.experience / 100) + 1;
  const container = document.querySelector('.container');

  // Actualizamos el HTML
  container.innerHTML = `
    <div class="game-over">
      <h2>¡Game finished!</h2>
      <p>Final score: ${score}</p>
      <p>Experience gained: +${score}</p>
      <p>Total experience: ${oldExperience} → ${userProgress.experience}</p>
      <p>Current level: ${level} - ${getLevelTitle(level)}</p>
      <button onclick="window.location.reload()">Back to menu</button>
    </div>
  `;
}

function generateOperation(gameType) {
  let num1, num2, correctAnswer, operation;

  switch (gameType) {
    case 'sumas':
      num1 = generateRandomNumber(1, 20);
      num2 = generateRandomNumber(1, 20);
      operation = `${num1} + ${num2}`;
      correctAnswer = num1 + num2;
      break;
    case 'restas':
      num1 = generateRandomNumber(5, 30);
      num2 = generateRandomNumber(1, num1);
      operation = `${num1} - ${num2}`;
      correctAnswer = num1 - num2;
      break;
    case 'multiplicaciones':
      num1 = generateRandomNumber(1, 9);
      num2 = generateRandomNumber(1, 9);
      operation = `${num1} × ${num2}`;
      correctAnswer = num1 * num2;
      break;
    case 'divisiones':
      num2 = generateRandomNumber(1, 9);
      correctAnswer = generateRandomNumber(1, 9);
      num1 = num2 * correctAnswer;
      operation = `${num1} ÷ ${num2}`;
      break;
  }

  return { operation, correctAnswer };
}

function startGame(gameType) {
  let score = 0;
  createGameInterface(gameType);

  const exitButton = document.getElementById('exit');
  exitButton.addEventListener('click', () => {
    showGameOver(score);
  });

  if (gameType === 'memoria') {
    startMemoryGame(score);
  } else if (gameType === 'logica') {
    startHiddenNumberGame(score);
  } else {
    startMathGame(gameType, score);
  }
}

function startMemoryGame(initialScore) {
  let score = initialScore;
  let sequence = [];
  let playerSequence = [];
  let level = 1;
  document.getElementById('score').textContent = score;

  const gameArea = document.getElementById('game-area');
  gameArea.innerHTML = `
    <div class="memory-game">
      <div id="sequence" class="sequence"></div>
      <div id="memory-message">Watch the sequence</div>
      <div class="memory-buttons">
        <button class="memory-btn" data-color="red">🔴</button>
        <button class="memory-btn" data-color="blue">🔵</button>
        <button class="memory-btn" data-color="green">🟢</button>
        <button class="memory-btn" data-color="yellow">🟡</button>
      </div>
    </div>
  `;

  function addToSequence() {
    const colors = ['red', 'blue', 'green', 'yellow'];
    sequence.push(colors[Math.floor(Math.random() * colors.length)]);
    return showSequence();
  }

  function showSequence() {
    const sequenceDiv = document.getElementById('sequence');
    const message = document.getElementById('memory-message');
    message.textContent = 'Watch the sequence';

    return new Promise((resolve) => {
      let i = 0;
      sequenceDiv.innerHTML = '';

      const interval = setInterval(() => {
        if (i < sequence.length) {
          sequenceDiv.innerHTML = `<div class="memory-circle ${sequence[i]}"></div>`;
          setTimeout(() => {
            sequenceDiv.innerHTML = '';
          }, 800);
          i++;
        } else {
          message.textContent = '¡Repeat the sequence!';
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  }

  function startNewRound() {
    playerSequence = [];
    addToSequence().then(() => {
      const buttons = document.querySelectorAll('.memory-btn');
      buttons.forEach(btn => {
        btn.onclick = (e) => {
          const color = e.target.dataset.color;
          playerSequence.push(color);

          if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
            showGameOver(score);
          } else if (playerSequence.length === sequence.length) {
            score += 10 * level;
            document.getElementById('score').textContent = score;
            level++;
            setTimeout(startNewRound, 1000);
          }
        };
      });
    });
  }

  startNewRound();
}

function startHiddenNumberGame(initialScore) {
  let score = initialScore;
  let targetNumber = Math.floor(Math.random() * 100) + 1;
  let attempts = 0;

  const gameArea = document.getElementById('game-area');
  gameArea.innerHTML = `
    <div class="hidden-number">
      <p>Adivina el número entre 1 y 100</p>
      <div id="hints"></div>
      <input type="number" id="guess" min="1" max="100">
      <button id="submit-guess">Guess</button>
    </div>
  `;

  const hintsDiv = document.getElementById('hints');
  const guessInput = document.getElementById('guess');
  const submitGuess = document.getElementById('submit-guess');

  submitGuess.onclick = () => {
    const guess = parseInt(guessInput.value);
    attempts++;

    if (guess === targetNumber) {
      const pointsEarned = Math.max(0, 50 - (attempts * 5));
      score += pointsEarned;
      document.getElementById('score').textContent = score;

      targetNumber = Math.floor(Math.random() * 100) + 1;
      attempts = 0;
      hintsDiv.innerHTML = '<p class="success">Correct! New round...</p>';
      guessInput.value = '';
    } else {
      const hint = guess < targetNumber ? 'Higher' : 'Lower';
      hintsDiv.innerHTML += `<p>${hint}</p>`;
      if (attempts >= 10) {
        showGameOver(score);
      }
    }
  };

  guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitGuess.click();
    }
  });
}

function startMathGame(gameType, initialScore) {
  let score = initialScore;
  let currentAnswer;

  const container = document.querySelector('.game-interface');
  container.innerHTML = `
    <div class="score">Points: <span id="score">0</span></div>
    <div id="game-area">
      <div class="operation" id="operation"></div>
      <input type="number" id="answer" placeholder="Your answer">
      <button id="submit">Check</button>
    </div>
    <button id="exit">End game</button>
  `;

  const gameArea = document.getElementById('game-area');
  const scoreElement = document.getElementById('score');
  const exitButton = document.getElementById('exit');
  const answerInput = document.getElementById('answer');
  const submitButton = document.getElementById('submit');
  const operationElement = document.getElementById('operation');

  function updateGame() {
    const { operation, correctAnswer } = generateOperation(gameType);
    currentAnswer = correctAnswer;
    operationElement.textContent = operation;
    answerInput.value = '';
  }

  submitButton.addEventListener('click', () => {
    const userAnswer = parseInt(answerInput.value);
    if (userAnswer === currentAnswer) {
      score += 10;
      scoreElement.textContent = score;
      updateGame();
    } else {
      score = Math.max(0, score - 5);
      scoreElement.textContent = score;
    }
  });

  answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitButton.click();
    }
  });

  exitButton.addEventListener('click', () => {
    showGameOver(score);
  });

  updateGame();
}