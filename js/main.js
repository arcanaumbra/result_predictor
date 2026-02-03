import { Auth } from './auth.js';
import { questions } from './data.js';

// --- STATE MANAGEMENT ---
const state = {
    currentScreen: 'auth-screen',
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
    }

    // 2. Setup Event Listeners
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    document.getElementById('btn-logout').addEventListener('click', Auth.logout);
    document.getElementById('btn-start-quiz').addEventListener('click', startQuiz);
}

// --- SCREEN SWITCHING ---
function switchScreen(screenName) {
    // Hide all
    Object.values(screens).forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    // Show target
    screens[screenName].classList.remove('hidden');
    // Small delay to allow display:flex to apply before adding opacity class for animation
    setTimeout(() => screens[screenName].classList.add('active'), 10);
}

// --- AUTH LOGIC ---
function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('inp-name').value;
    const dept = document.getElementById('inp-dept').value;
    const year = document.getElementById('inp-year').value;
    const email = document.getElementById('inp-email').value;
    const phone = document.getElementById('inp-phone').value;

    const user = Auth.signUp(name, dept, year, email, phone);
    updateProfileUI(user);
    switchScreen('dashboard');
}

function updateProfileUI(user) {
    // Header
    document.getElementById('user-display').classList.remove('hidden');
    document.getElementById('user-name-display').innerText = user.name.toUpperCase();
    
    // Dashboard
    document.getElementById('dash-name').innerText = user.name;
    document.getElementById('dash-dept').innerText = user.dept.toUpperCase();
    
    // Result Page
    document.getElementById('res-name').innerText = user.name;
    document.getElementById('res-id').innerText = user.id;
}

// --- QUIZ LOGIC ---
function startQuiz() {
    // Calculate Max Score
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

    // UI Updates
    qText.style.opacity = 0;
    setTimeout(() => {
        qText.innerText = q.text;
        qText.style.opacity = 1;
    }, 200);

    tracker.innerText = `${String(state.questionIdx + 1).padStart(2, '0')} / ${questions.length}`;
    bar.style.width = `${(state.questionIdx / questions.length) * 100}%`;

    // Render Options
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
    // Lock buttons
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');
    btn.classList.add('selected');

    // Add Score
    state.score += (val * weight);

    // Delay for effect
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
    
    // Simulate complex calculations
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
    
    // UI Elements
    const ring = document.getElementById('score-ring-fg');
    const scoreNum = document.getElementById('final-score');
    const title = document.getElementById('result-title');
    const desc = document.getElementById('result-desc');

    // Logic
    let color = '#ff0055'; 
    let t = "High Risk";
    let d = "Probability of passing is low based on provided metrics.";

    if (percentage > 40) { color = '#f59e0b'; t = "Borderline"; d = "You are on the edge. Results may vary."; }
    if (percentage > 65) { color = '#00f2ff'; t = "Safe Pass"; d = "Good probability of clearing the exam."; }
    if (percentage > 85) { color = '#00ff88'; t = "Excellent"; d = "High probability of distinction."; }

    // Apply Styles
    ring.style.stroke = color;
    title.style.color = color;
    title.innerText = t;
    desc.innerText = d;

    // Animate Ring
    const offset = 565 - (565 * percentage) / 100;
    setTimeout(() => ring.style.strokeDashoffset = offset, 100);

    // Animate Number
    let count = 0;
    const numInterval = setInterval(() => {
        if (count >= percentage) clearInterval(numInterval);
        else {
            count++;
            scoreNum.innerText = count;
        }
    }, 20);
}
