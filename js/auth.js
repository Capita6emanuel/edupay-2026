/* ====================================
   EDUPAY 2026 - AUTHENTICATION
   ==================================== */

// Authentication State
const auth = {
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userEmail: localStorage.getItem('userEmail') || '',
    userName: localStorage.getItem('userName') || 'Utilizador',
    userRole: localStorage.getItem('userRole') || 'admin',
    token: localStorage.getItem('authToken') || ''
};

// Validate user session on page load
function validateSession() {
    if (!auth.isLoggedIn) {
        redirectToLogin();
    }
}

// Redirect to login
function redirectToLogin() {
    window.location.href = 'login.html';
}

// Login user
function loginUser(email, password) {
    // Simulate API call
    const users = {
        'admin@edupay.pt': 'admin123',
        'admin@escola.pt': 'password123'
    };

    if (users[email] === password) {
        auth.isLoggedIn = true;
        auth.userEmail = email;
        auth.userName = 'Administrador';
        auth.userRole = 'admin';
        auth.token = generateToken();

        // Save to localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', auth.userName);
        localStorage.setItem('userRole', auth.userRole);
        localStorage.setItem('authToken', auth.token);

        return true;
    }
    return false;
}

// Logout user
function logoutUser() {
    auth.isLoggedIn = false;
    auth.userEmail = '';
    auth.userName = '';
    auth.token = '';

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('authToken');

    redirectToLogin();
}

// Generate JWT-like token
function generateToken() {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
        email: auth.userEmail,
        role: auth.userRole,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400
    }));
    const signature = btoa('secret');
    return `${header}.${payload}.${signature}`;
}

// Check if user is authenticated
function isAuthenticated() {
    return auth.isLoggedIn && !!auth.token;
}

// Get current user
function getCurrentUser() {
    return {
        email: auth.userEmail,
        name: auth.userName,
        role: auth.userRole
    };
}

// API Request wrapper
function apiRequest(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
        }
    };

    return fetch(endpoint, { ...defaultOptions, ...options })
        .then(response => {
            if (response.status === 401) {
                logoutUser();
            }
            return response.json();
        })
        .catch(error => {
            console.error('API Error:', error);
            throw error;
        });
}

// Password validation
function validatePassword(password) {
    return password.length >= 8;
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Form validation
function validateLoginForm(email, password) {
    const errors = [];

    if (!email) {
        errors.push('Email é obrigatório');
    } else if (!validateEmail(email)) {
        errors.push('Email inválido');
    }

    if (!password) {
        errors.push('Palavra-passe é obrigatória');
    } else if (!validatePassword(password)) {
        errors.push('Palavra-passe deve ter pelo menos 8 caracteres');
    }

    return errors;
}

// Show notification
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification show ${type}`;
        setTimeout(() => {
            notification.classList.remove('show');
        }, duration);
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { auth, loginUser, logoutUser, isAuthenticated, getCurrentUser };
}
