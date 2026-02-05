import { departments, countryCodes } from './data.js';

const STORAGE_KEY = 'neural_ai_user';

export const Auth = {
    // Check if user is logged in
    isLoggedIn: () => {
        return localStorage.getItem(STORAGE_KEY) !== null;
    },

    getUser: () => {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    },

    saveUser: (data) => {
        const user = {
            ...data,
            id: 'ID-' + Math.floor(1000 + Math.random() * 9000),
            joined: new Date().toLocaleDateString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        return user;
    },

    logout: () => {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    },

    // --- FORM LOGIC ---
    initForm: (switchScreenCb) => {
        const formState = {
            step: 1,
            data: {},
            valid: { email: false, phone: false, password: false, match: false, username: false }
        };

        // 1. POPULATE DROPDOWNS
        const deptSelect = document.getElementById('inp-dept');
        // Clear existing to prevent duplicates if called twice
        deptSelect.innerHTML = '<option value="" disabled selected>Select Department</option>';
        departments.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d;
            opt.innerText = d;
            deptSelect.appendChild(opt);
        });

        const countrySelect = document.getElementById('inp-country-code');
        countrySelect.innerHTML = '';
        countryCodes.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.code;
            opt.innerText = `${c.flag} ${c.code}`;
            countrySelect.appendChild(opt);
        });

        // 2. VALIDATION HELPERS
        const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const validatePhone = (phone) => /^\d{10}$/.test(phone); // Simple 10 digit check

        // 3. EVENT LISTENERS (STEP 1)
        const emailInp = document.getElementById('inp-email');
        const phoneInp = document.getElementById('inp-phone');
        const nextBtn = document.getElementById('btn-next');

        emailInp.addEventListener('input', (e) => {
            const isValid = validateEmail(e.target.value);
            toggleValidUI(e.target, isValid, "Invalid email format");
            formState.valid.email = isValid;
        });

        phoneInp.addEventListener('input', (e) => {
            // Remove non-numeric
            e.target.value = e.target.value.replace(/\D/g, '');
            const isValid = validatePhone(e.target.value);
            toggleValidUI(e.target, isValid, "Must be 10 digits", document.getElementById('phone-msg'));
            formState.valid.phone = isValid;
        });

        nextBtn.addEventListener('click', () => {
            const name = document.getElementById('inp-name').value;
            const dept = document.getElementById('inp-dept').value;
            const year = document.getElementById('inp-year').value;

            if(name && dept && year && formState.valid.email && formState.valid.phone) {
                formState.data = { name, dept, year, email: emailInp.value, phone: countrySelect.value + phoneInp.value };
                goToStep(2);
            } else {
                alert("Please fill all fields correctly.");
            }
        });

        // 4. EVENT LISTENERS (STEP 2)
        const userInp = document.getElementById('inp-username');
        const passInp = document.getElementById('inp-pass');
        const passConf = document.getElementById('inp-pass-confirm');
        const submitBtn = document.getElementById('btn-submit');
        const backBtn = document.getElementById('btn-back');

        // Username Checker
        let userTimeout;
        userInp.addEventListener('input', (e) => {
            const val = e.target.value;
            const statusBox = document.querySelector('.username-status');
            const statusText = document.querySelector('.status-text');
            const loader = document.querySelector('.loader-spinner');
            
            if(val.length < 3) {
                statusBox.classList.add('hidden');
                formState.valid.username = false;
                return;
            }

            statusBox.classList.remove('hidden');
            loader.style.display = 'block';
            statusText.innerText = "Checking...";
            statusText.className = 'status-text'; // reset color

            clearTimeout(userTimeout);
            userTimeout = setTimeout(() => {
                loader.style.display = 'none';
                statusText.innerText = "Available ✓";
                statusText.classList.add('available');
                formState.valid.username = true;
                checkSubmit();
            }, 800); // Fake delay
        });

        // Password Logic
        passInp.addEventListener('input', (e) => {
            const val = e.target.value;
            const checks = {
                len: val.length >= 8,
                num: /\d/.test(val),
                up: /[A-Z]/.test(val),
                spec: /[!@#$%^&*(),.?":{}|<>]/.test(val)
            };

            // Update UI
            updateChecklist('chk-len', checks.len);
            updateChecklist('chk-num', checks.num);
            updateChecklist('chk-up', checks.up);
            updateChecklist('chk-spec', checks.spec);

            formState.valid.password = Object.values(checks).every(Boolean);
            validateMatch();
            checkSubmit();
        });

        passConf.addEventListener('input', validateMatch);

        function validateMatch() {
            const isMatch = passInp.value === passConf.value && passInp.value !== '';
            const msg = document.getElementById('match-msg');
            
            if(passConf.value === '') {
                passConf.classList.remove('valid', 'invalid');
                msg.innerText = "";
            } else if(isMatch) {
                passConf.classList.add('valid');
                passConf.classList.remove('invalid');
                msg.innerText = "";
                formState.valid.match = true;
            } else {
                passConf.classList.add('invalid');
                passConf.classList.remove('valid');
                msg.innerText = "Passwords do not match";
                formState.valid.match = false;
            }
            checkSubmit();
        }

        function checkSubmit() {
            if(formState.valid.username && formState.valid.password && formState.valid.match) {
                submitBtn.disabled = false;
            } else {
                submitBtn.disabled = true;
            }
        }

        backBtn.addEventListener('click', () => goToStep(1));

        document.getElementById('signup-form').addEventListener('submit', (e) => {
            e.preventDefault();
            formState.data.username = userInp.value;
            const user = Auth.saveUser(formState.data);
            switchScreenCb(user);
        });
    }
};

// UI Helpers
function toggleValidUI(el, isValid, errorMsg, msgEl = null) {
    const msg = msgEl || el.parentElement.querySelector('.validation-msg');
    if(el.value === '') {
        el.classList.remove('valid', 'invalid');
        if(msg) msg.innerText = '';
        return;
    }
    if(isValid) {
        el.classList.add('valid');
        el.classList.remove('invalid');
        if(msg) msg.innerText = '';
    } else {
        el.classList.add('invalid');
        el.classList.remove('valid');
        if(msg) msg.innerText = errorMsg;
    }
}

function updateChecklist(id, passed) {
    const el = document.getElementById(id);
    const icon = el.querySelector('.icon');
    if(passed) {
        el.classList.add('checked');
        icon.innerText = "●";
    } else {
        el.classList.remove('checked');
        icon.innerText = "○";
    }
}

function goToStep(step) {
    const s1 = document.getElementById('form-step-1');
    const s2 = document.getElementById('form-step-2');
    const d1 = document.getElementById('step-dot-1');
    const d2 = document.getElementById('step-dot-2');
    const title = document.getElementById('auth-title');

    if(step === 1) {
        s1.classList.remove('hidden');
        s2.classList.add('hidden');
        d2.classList.remove('active');
        title.innerHTML = `Personal <span class="gradient-text">Data</span>`;
    } else {
        s1.classList.add('hidden');
        s2.classList.remove('hidden');
        s2.style.animation = "fadeUp 0.5s ease"; // Re-trigger animation
        d2.classList.add('active');
        title.innerHTML = `Account <span class="gradient-text">Security</span>`;
    }
}
