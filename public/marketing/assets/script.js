// Additional JavaScript functionality for Tabata Welfare Association website

// Utility functions
const utils = {
    // Debounce function for performance optimization
    debounce: (func, wait) => {
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

    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Format currency for Tanzania Shilling
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('sw-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    },

    // Validate email format
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate phone number (Tanzania format)
    isValidPhone: (phone) => {
        const phoneRegex = /^(\+255|0)[67]\d{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
};

// Enhanced form validation
class FormValidator {
    constructor(formElement) {
        this.form = formElement;
        this.errors = {};
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', utils.debounce(() => this.validateField(input), 300));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value && !utils.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }

        // Phone validation
        if (field.type === 'tel' && value && !utils.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid Tanzania phone number';
        }

        // Name validation (no numbers)
        if ((name === 'first-name' || name === 'last-name') && value && /\d/.test(value)) {
            isValid = false;
            errorMessage = 'Name should not contain numbers';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
            this.errors[name] = errorMessage;
        } else {
            delete this.errors[name];
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');

        // Create or update error message
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('p');
            errorElement.className = 'error-message text-red-500 text-sm mt-1';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            this.showFormError('Please correct the errors above');
            return;
        }

        this.submitForm();
    }

    showFormError(message) {
        let errorElement = this.form.querySelector('.form-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error alert alert-error';
            this.form.insertBefore(errorElement, this.form.firstChild);
        }
        errorElement.textContent = message;
    }

    showFormSuccess(message) {
        let successElement = this.form.querySelector('.form-success');
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.className = 'form-success alert alert-success';
            this.form.insertBefore(successElement, this.form.firstChild);
        }
        successElement.textContent = message;
    }

    async submitForm() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        // Show loading state
        submitButton.innerHTML = '<div class="spinner inline-block mr-2"></div>Sending...';
        submitButton.disabled = true;

        try {
            // Simulate API call (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));

            this.showFormSuccess('Thank you for your message! We will get back to you soon.');
            this.form.reset();

            // Clear any existing errors
            Object.keys(this.errors).forEach(key => delete this.errors[key]);

        } catch (error) {
            this.showFormError('Sorry, there was an error sending your message. Please try again.');
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }
}

// Enhanced stats counter with intersection observer
class StatsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stats-counter');
        this.hasAnimated = false;
        this.init();
    }

    init() {
        if (this.counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateCounters();
                    this.hasAnimated = true;
                }
            });
        }, { threshold: 0.5 });

        // Observe the first counter's parent section
        const statsSection = this.counters[0].closest('section');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            this.animateCounter(counter, target);
        });
    }

    animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const duration = 2000; // 2 seconds
        const stepTime = duration / 100;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            element.textContent = this.formatNumber(Math.floor(current));
        }, stepTime);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        } else {
            return num.toString();
        }
    }
}

// Smooth scroll with offset for fixed header
class SmoothScroll {
    constructor() {
        this.headerHeight = 80; // Adjust based on your header height
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleClick(e));
        });
    }

    handleClick(e) {
        const targetId = e.currentTarget.getAttribute('href');

        // Only handle internal anchor links (starting with #)
        if (!targetId.startsWith('#')) {
            // Allow external links (like /login) to work normally
            return;
        }

        e.preventDefault();
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const targetPosition = targetElement.offsetTop - this.headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize form validation
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        new FormValidator(contactForm);
    }

    // Initialize stats counter
    new StatsCounter();

    // Initialize smooth scroll
    new SmoothScroll();

    // Initialize other interactive elements
    initializeInteractiveElements();
});

function initializeInteractiveElements() {
    // Lazy loading for images (only for images with data-src)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        // Only observe images that actually have data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Add loading states to buttons (exclude anchor links)
    document.querySelectorAll('button:not([type="submit"]), input[type="button"]').forEach(button => {
        button.addEventListener('click', function () {
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000);
        });
    });

    // Add hover effects to cards
    document.querySelectorAll('.card-hover').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Ensure login links work properly
    document.querySelectorAll('a[href="/login"], .btn-member-login').forEach(link => {
        link.addEventListener('click', function (e) {
            e.stopPropagation(); // Stop other event handlers
            console.log('Login link clicked, navigating to:', this.href);
            window.location.href = this.href;
        });
    });
}

// Export utilities for use in other scripts
window.TabataWelfare = {
    utils,
    FormValidator,
    StatsCounter,
    SmoothScroll
};
