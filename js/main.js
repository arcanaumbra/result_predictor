import { Auth } from './auth.js';
import { questions } from './data.js';

// --- STATE MANAGEMENT ---
const state = {
    questionIdx: 0,
    score: 0,
    maxScore: 0
};

// --- DOM ELEMENTS ---
const screens = {
    auth: document.getElementById('auth-screen'),
    dashboard: document.getElementById('dashboard-screen'),
    quiz: document.getElementById('quiz-screen'),
    loading: document.getElementById('loading-screen'),
    result: document.getElementById('result-screen')
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // 1. Check Login Status
    if (Auth.isLoggedIn()) {
        const user = Auth.getUser();
        updateProfileUI(user);
        switchScreen('dashboard');
    } else {
        switchScreen('auth');
        // Initialize the complex form logic
        Auth.initForm((user) => {
            updateProfileUI(user);
            switchScreen('dashboard');
        });
    }

    // 2. Setup Event Listeners
    document.getElementById('btn-logout').addEventListener('click', Auth.logout);
    document.getElementById('btn-start-quiz').addEventListener('click', startQuiz);
}

// --- SCREEN SWITCHING ---
function switchScreen(screenName) {
    Object.values(screens).forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    screens[screenName].classList.remove('hidden');
    setTimeout(() => screens[screenName].classList.add('active'), 10);
}

// --- UI UPDATER (FIXED CRASH HERE) ---
function updateProfileUI(user) {
    if (!user) return;

    // Header
    const userDisplay = document.getElementById('user-display');
    const userNameDisplay = document.getElementById('user-name-display');
    
    if(userDisplay) userDisplay.classList.remove('hidden');
    if(userNameDisplay) userNameDisplay.innerText = user.username ? user.username.toUpperCase() : "USER";
    
    // Dashboard
    const dashName = document.getElementById('dash-name');
    const dashDept = document.getElementById('dash-dept');
    
    if(dashName) dashName.innerText = user.name;
    
    // Safe Department Parsing
    if(dashDept && user.dept) {
        if(user.dept.includes('(')) {
            dashDept.innerText = user.dept.split('(')[1].replace(')', ''); 
        } else {
            dashDept.innerText = user.dept; 
        }
    }
}

// --- QUIZ LOGIC ---
function startQuiz() {
    state.maxScore = questions.reduce((acc, q) => acc + (10 * q.weight), 0);
    state.score = 0;
    state.questionIdx = 0;
    
    switchScreen('quiz');
    renderQuestion();
}

function renderQuestion() {
    const q = questions[state.questionIdx];
    const container = document.getElementById('options-container');
    const qText = document.getElementById('question-text');
    const tracker = document.getElementById('q-tracker');
    const bar = document.getElementById('progress-bar');

    qText.style.opacity = 0;
    setTimeout(() => {
        qText.innerText = q.text;
        qText.style.opacity = 1;
    }, 200);

    tracker.innerText = `${String(state.questionIdx + 1).padStart(2, '0')} / ${questions.length}`;
    bar.style.width = `${(state.questionIdx / questions.length) * 100}%`;

    container.innerHTML = '';
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt.text;
        btn.style.animation = `fadeUp 0.3s ease forwards ${idx * 0.1}s`;
        btn.onclick = () => handleAnswer(opt.value, q.weight, btn);
        container.appendChild(btn);
    });
}

function handleAnswer(val, weight, btn) {
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');
    btn.classList.add('selected');
    state.score += (val * weight);

    setTimeout(() => {
        state.questionIdx++;
        if (state.questionIdx < questions.length) {
            renderQuestion();
        } else {
            finishQuiz();
        }
    }, 500);
}

function finishQuiz() {
    switchScreen('loading');
    const loadingText = document.getElementById('loading-text');
    const steps = ["Parsing inputs...", "Normalizing weights...", "Predicting outcome..."];
    let step = 0;

    const interval = setInterval(() => {
        if (step < steps.length) {
            loadingText.innerText = steps[step];
            step++;
        } else {
            clearInterval(interval);
            showResult();
        }
    }, 800);
}

function showResult() {
    switchScreen('result');
    const percentage = Math.round((state.score / state.maxScore) * 100);
    const ring = document.getElementById('score-ring-fg');
    const scoreNum = document.getElementById('final-score');
    const title = document.getElementById('result-title');
    const desc = document.getElementById('result-desc');

    let color = '#ff0055'; 
    let t = "High Risk";
    let d = "Probability of passing is low.";

    if (percentage > 40) { color = '#f59e0b'; t = "Borderline"; d = "You are on the edge."; }
    if (percentage > 65) { color = '#00f2ff'; t = "Safe Pass"; d = "Good probability of clearing."; }
    if (percentage > 85) { color = '#00ff88'; t = "Excellent"; d = "High probability of distinction."; }

    ring.style.stroke = color;
    title.style.color = color;
    title.innerText = t;
    desc.innerText = d;

    const offset = 565 - (565 * percentage) / 100;
    setTimeout(() => ring.style.strokeDashoffset = offset, 100);

    let count = 0;
    const numInterval = setInterval(() => {
        if (count >= percentage) clearInterval(numInterval);
        else { count++; scoreNum.innerText = count; }
    }, 20);
}
