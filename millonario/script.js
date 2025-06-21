const quizBox = document.getElementById('quiz-box');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const timeEl = document.getElementById('time');
const resultEl = document.getElementById('result');
const scoreEl = document.getElementById('score');

const restartBtn = document.createElement('button');
restartBtn.textContent = 'Volver a jugar';
restartBtn.id = 'restart-btn';
restartBtn.classList.add('hidden');
restartBtn.onclick = () => {
  resetQuiz();
};
document.querySelector('.container').appendChild(restartBtn);

let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timerInterval;
let questions = [];

function fetchQuestions() {
  return new Promise((resolve, reject) => {
    fetch('https://opentdb.com/api.php?amount=5&type=multiple')
      .then(response => response.json())
      .then(data => {
        questions = data.results;
        resolve(); 
      })
      .catch(error => {
        console.error('Error al obtener preguntas:', error);
        reject(error); 
      });
  });
}

function startQuiz() {
  quizBox.classList.remove('hidden');
  resultEl.classList.add('hidden');
  restartBtn.classList.add('hidden');
  currentQuestion = 0;
  score = 0;
  timeLeft = 60;
  timeEl.textContent = timeLeft;

  showQuestion();

  timerInterval = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      endQuiz();
    }
  }, 1000);
}

function showQuestion() {
  const q = questions[currentQuestion];
  questionEl.innerHTML = decodeHTML(q.question);
  const options = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
  answersEl.innerHTML = '';
  options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = decodeHTML(option);
    btn.onclick = () => {
      if (option === q.correct_answer) {
        score++;
      }
      nextQuestion();
    };
    answersEl.appendChild(btn);
  });
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length && timeLeft > 0) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  clearInterval(timerInterval);
  quizBox.classList.add('hidden');
  resultEl.classList.remove('hidden');
  scoreEl.textContent = `${score} / ${questions.length}`;
  restartBtn.classList.remove('hidden'); 
}

function resetQuiz() {
  fetchQuestions().then(() => {
    startQuiz();
  });
}

function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

fetchQuestions().then(() => {
  startQuiz();
});
