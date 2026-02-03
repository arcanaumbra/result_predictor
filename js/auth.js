const STORAGE_KEY = 'neural_ai_user';

export const Auth = {
    // Check if user is logged in
    isLoggedIn: () => {
        return localStorage.getItem(STORAGE_KEY) !== null;
    },

    // Get user data object
    getUser: () => {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    },

    // Save user data (Sign Up)
    signUp: (name, dept, year, email, phone) => {
        const user = {
            name: name,
            dept: dept,
            year: year,
            email: email,
            phone: phone,
            id: 'ID-' + Math.floor(Math.random() * 10000), // Fake ID generation
            joined: new Date().toLocaleDateString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        return user;
    },

    // Clear session
    logout: () => {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
};
