/* ====================================
   EDUPAY 2026 - MAIN APPLICATION
   ==================================== */

// Initialize app on document ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    console.log('EduPay 2026 initialized');
    initializeNavigation();
    initializeScrollAnimations();
    initializeButtonHandlers();
}

// Navigation initialization
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.navbar-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            const element = document.querySelector(target);
            
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .benefit-item, .pricing-card').forEach(el => {
        observer.observe(el);
    });
}

// Button handlers
function initializeButtonHandlers() {
    // Feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    // Pricing buttons
    document.querySelectorAll('.pricing-card .btn-primary').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const planName = this.closest('.pricing-card').querySelector('.pricing-label').textContent;
            showNotification(`Plano "${planName}" selecionado! Redirecionando para checkout...`, 'success');
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 2000);
        });
    });

    // Demo button
    document.querySelectorAll('.btn-secondary').forEach(button => {
        button.addEventListener('click', function() {
            showNotification('Demo em breve disponível!', 'info');
        });
    });
}

// Notification helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type} show`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Get notification color
function getNotificationColor(type) {
    const colors = {
        'success': '#22c55e',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6'
    };
    return colors[type] || colors['info'];
}

// Smooth scroll polyfill
if (!window.CSS || !CSS.supports('scroll-behavior', 'smooth')) {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Mobile menu toggle (if header is responsive)
function toggleMobileMenu() {
    const menu = document.querySelector('.navbar-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Utility functions
const utils = {
    // Format currency
    formatCurrency(value, currency = 'EUR') {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: currency
        }).format(value);
    },

    // Format date
    formatDate(date, format = 'pt-PT') {
        return new Intl.DateTimeFormat(format).format(new Date(date));
    },

    // Format number
    formatNumber(value) {
        return new Intl.NumberFormat('pt-PT').format(value);
    },

    // Get query parameter
    getQueryParam(param) {
        const url = new URLSearchParams(window.location.search);
        return url.get(param);
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Export utilities
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { utils, showNotification };
}
