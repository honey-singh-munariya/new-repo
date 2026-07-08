

let currentPool = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let stats = {
    startTime: null,
    correctAnswers: 0,
    totalTimeTaken: 0
};

document.addEventListener('DOMContentLoaded', () => {
    initPracticeSession();
});

function initPracticeSession() {
    // 1. Shuffle the 100+ questions pool
    currentPool = [...allQuestionsPool].sort(() => Math.random() - 0.5);
    
    // 2. Limit to a 10-question session for better UX
    currentPool = currentPool.slice(0, 10);
    
    currentIndex = 0;
    score = 0;
    stats.startTime = Date.now();

    // 3. Transition UI
    setTimeout(() => {
        document.getElementById('setup-screen').classList.add('hidden');
        document.getElementById('quiz-screen').classList.remove('hidden');
        loadQuestion();
    }, 2000); // Simulated "Preparing" time
}

function loadQuestion() {
    resetState();
    const q = currentPool[currentIndex];
    
    // Update UI elements
    document.getElementById('question-text').innerText = q.q;
    document.getElementById('course-tag').innerText = q.subject;
    document.getElementById('progress-text').innerText = `Question ${currentIndex + 1}/${currentPool.length}`;
    
    // Progress Bar
    const progressPercent = ((currentIndex + 1) / currentPool.length) * 100;
    document.getElementById('progress-bar-inner').style.width = `${progressPercent}%`;

    // Render Options
    const optionsContainer = document.getElementById('options-container');
    q.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.innerHTML = `<span class="opt-prefix">${String.fromCharCode(65 + index)}</span> ${option}`;
        button.onclick = () => selectAnswer(index, q.correct);
        optionsContainer.appendChild(button);
    });

    startTimer();
}

function startTimer() {
    timeLeft = 15;
    document.getElementById('time-left').innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            selectAnswer(-1, currentPool[currentIndex].correct); // Time out
        }
    }, 1000);
}

function resetState() {
    clearInterval(timer);
    const container = document.getElementById('options-container');
    while (container.firstChild) container.removeChild(container.firstChild);
}

function selectAnswer(selectedIndex, correctIndex) {
    clearInterval(timer);
    const buttons = document.querySelectorAll('.option-btn');
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);

    if (selectedIndex === correctIndex) {
        score++;
        stats.correctAnswers++;
        buttons[selectedIndex].classList.add('correct');
        updateXP(100);
    } else {
        if (selectedIndex !== -1) buttons[selectedIndex].classList.add('wrong');
        buttons[correctIndex].classList.add('correct');
    }

    setTimeout(() => {
        currentIndex++;
        if (currentIndex < currentPool.length) {
            loadQuestion();
        } else {
            endSession();
        }
    }, 1500);
}

function updateXP(amount) {
    const currentXP = parseInt(document.getElementById('total-points').innerText) || 0;
    document.getElementById('total-points').innerText = `${currentXP + amount} XP Earned`;
}

function endSession() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');

    const totalTime = Math.floor((Date.now() - stats.startTime) / 1000);
    const accuracy = Math.round((score / currentPool.length) * 100);

    document.getElementById('final-score-val').innerText = score;
    document.getElementById('total-questions-val').innerText = currentPool.length;
    document.getElementById('accuracy-val').innerText = `${accuracy}%`;
    document.getElementById('speed-val').innerText = `${Math.round(totalTime / currentPool.length)}s/q`;
}
