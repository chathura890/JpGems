// Main JavaScript for JP Gems Website

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize theme on page load
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Toggle theme function
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// User authentication state
let currentUser = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired!');
    initializeTheme();
    setupThemeToggle();
    checkLoginStatus();
    initializeProfileDropdown();
    generateProducts();
    initializeSlider();
    initializeKeyboardSupport();
    initializeStickyHeader();
});

// Always Visible Header with Scroll Effects
let ticking = false;

function initializeStickyHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
    
    // Handle resize events to maintain proper functionality
    window.addEventListener('resize', function() {
        adjustBodyPadding();
    });
    
    // Initial adjustment
    adjustBodyPadding();
}

function adjustBodyPadding() {
    const header = document.querySelector('header');
    const body = document.body;
    if (header && body) {
        const headerHeight = header.offsetHeight;
        body.style.paddingTop = headerHeight + 'px';
    }
}

function updateHeader() {
    const header = document.querySelector('header');
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow effect when scrolled down
    if (currentScrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    ticking = false;
}

// Setup theme toggle event listener
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// Initialize keyboard support
function initializeKeyboardSupport() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Check if user is logged in
function checkLoginStatus() {
    const userData = localStorage.getItem('jpgems_user');
    if (userData) {
        try {
            currentUser = JSON.parse(userData);
            updateUIForLoggedInUser();
        } catch (e) {
            localStorage.removeItem('jpgems_user');
        }
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    const profileIcon = document.querySelector('.profile-icon');
    const profileName = document.querySelector('.profile-name');
    
    if (profileIcon && currentUser) {
        profileIcon.innerHTML = `<i class="fas fa-user-circle"></i>`;
        if (profileName) {
            profileName.textContent = currentUser.name || 'User';
        }
    }
}

// Show login modal
function showLogin() {
    console.log('showLogin function called');
    closeAllModals();
    createLoginModal();
}

// Show signup modal  
function showSignup() {
    console.log('showSignup function called');
    closeAllModals();
    createSignupModal();
}

// Close all modals
function closeAllModals() {
    const existingModals = document.querySelectorAll('.auth-modal');
    existingModals.forEach(modal => modal.remove());
}

// Create login modal
function createLoginModal() {
    const modalHTML = `
        <div class="auth-modal" id="loginModal">
            <div class="modal-backdrop" onclick="closeAllModals()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-gem"></i> JP Gems Login</h2>
                    <button class="close-btn" onclick="closeAllModals()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="error-message" id="loginErrorMessage"></div>
                    <div class="success-message" id="loginSuccessMessage"></div>
                    
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="loginEmail">Email Address</label>
                            <div class="input-icon">
                                <input type="email" id="loginEmail" name="email" required>
                                <i class="fas fa-envelope"></i>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="loginPassword">Password</label>
                            <div class="input-icon">
                                <input type="password" id="loginPassword" name="password" required>
                                <i class="fas fa-lock"></i>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="rememberMe" name="rememberMe"> 
                                Remember me
                            </label>
                        </div>

                        <button type="submit" class="btn-auth">
                            <i class="fas fa-sign-in-alt"></i> Sign In
                        </button>
                    </form>

                    <div class="modal-links">
                        <p>Don't have an account? <a href="#" onclick="showSignup()">Sign up here</a></p>
                        <p><a href="#" onclick="showForgotPassword()">Forgot your password?</a></p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add form submit handler
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLoginSubmit);
    
    // Focus first input
    setTimeout(() => {
        document.getElementById('loginEmail').focus();
    }, 100);
}

// Create signup modal
function createSignupModal() {
    const modalHTML = `
        <div class="auth-modal" id="signupModal">
            <div class="modal-backdrop" onclick="closeAllModals()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-gem"></i> Create Account</h2>
                    <button class="close-btn" onclick="closeAllModals()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="error-message" id="signupErrorMessage"></div>
                    <div class="success-message" id="signupSuccessMessage"></div>
                    
                    <form id="signupForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="signupFirstName">First Name</label>
                                <input type="text" id="signupFirstName" name="firstName" required>
                            </div>
                            <div class="form-group">
                                <label for="signupLastName">Last Name</label>
                                <input type="text" id="signupLastName" name="lastName" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="signupEmail">Email Address</label>
                            <div class="input-icon">
                                <input type="email" id="signupEmail" name="email" required>
                                <i class="fas fa-envelope"></i>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="signupPhone">Phone Number</label>
                            <div class="input-icon">
                                <input type="tel" id="signupPhone" name="phone" required>
                                <i class="fas fa-phone"></i>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="signupPassword">Password</label>
                            <div class="input-icon">
                                <input type="password" id="signupPassword" name="password" required>
                                <i class="fas fa-lock"></i>
                            </div>
                            <div id="signupPasswordStrength" class="password-strength"></div>
                        </div>

                        <div class="form-group">
                            <label for="signupConfirmPassword">Confirm Password</label>
                            <div class="input-icon">
                                <input type="password" id="signupConfirmPassword" name="confirmPassword" required>
                                <i class="fas fa-lock"></i>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="signupTerms" name="terms" required> 
                                I agree to the <a href="#" target="_blank">Terms & Conditions</a>
                            </label>
                        </div>

                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="signupNewsletter" name="newsletter"> 
                                Subscribe to newsletter for exclusive offers
                            </label>
                        </div>

                        <button type="submit" class="btn-auth">
                            <i class="fas fa-user-plus"></i> Create Account
                        </button>
                    </form>

                    <div class="modal-links">
                        <p>Already have an account? <a href="#" onclick="showLogin()">Sign in here</a></p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add form submit handler
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', handleSignupSubmit);
    
    // Add password strength checker
    const passwordInput = document.getElementById('signupPassword');
    passwordInput.addEventListener('input', checkPasswordStrength);
    
    // Focus first input
    setTimeout(() => {
        document.getElementById('signupFirstName').focus();
    }, 100);
}

// Handle login form submission
async function handleLoginSubmit(e) {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value,
        rememberMe: document.getElementById('rememberMe').checked
    };
    
    const errorDiv = document.getElementById('loginErrorMessage');
    const successDiv = document.getElementById('loginSuccessMessage');
    
    // Hide previous messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    try {
        // Determine correct API path
        let apiPath = 'php/auth/login.php';
        if (window.location.pathname.includes('/html/')) {
            apiPath = '../php/auth/login.php';
        }
        
        const response = await fetch(apiPath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Store user data
            localStorage.setItem('jpgems_user', JSON.stringify(data.user));
            currentUser = data.user;
            
            successDiv.textContent = 'Login successful! Welcome back!';
            successDiv.style.display = 'block';
            
            // Update UI and close modal after 1 second
            setTimeout(() => {
                updateUIForLoggedInUser();
                closeAllModals();
            }, 1000);
        } else {
            errorDiv.textContent = data.message || 'Login failed. Please try again.';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Network error. Please try again.';
        errorDiv.style.display = 'block';
    }
}

// Handle signup form submission
async function handleSignupSubmit(e) {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('signupFirstName').value,
        lastName: document.getElementById('signupLastName').value,
        email: document.getElementById('signupEmail').value,
        phone: document.getElementById('signupPhone').value,
        password: document.getElementById('signupPassword').value,
        confirmPassword: document.getElementById('signupConfirmPassword').value,
        terms: document.getElementById('signupTerms').checked,
        newsletter: document.getElementById('signupNewsletter').checked
    };
    
    const errorDiv = document.getElementById('signupErrorMessage');
    const successDiv = document.getElementById('signupSuccessMessage');
    
    // Hide previous messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
        errorDiv.textContent = 'Passwords do not match.';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (!formData.terms) {
        errorDiv.textContent = 'Please accept the Terms & Conditions.';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        // Determine correct API path
        let apiPath = 'php/auth/signup.php';
        if (window.location.pathname.includes('/html/')) {
            apiPath = '../php/auth/signup.php';
        }
        
        const response = await fetch(apiPath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            successDiv.textContent = 'Account created successfully! You can now log in.';
            successDiv.style.display = 'block';
            
            // Show login modal after 2 seconds
            setTimeout(() => {
                showLogin();
            }, 2000);
        } else {
            errorDiv.textContent = data.message || 'Registration failed. Please try again.';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Network error. Please try again.';
        errorDiv.style.display = 'block';
    }
}

// Check password strength
function checkPasswordStrength() {
    const password = document.getElementById('signupPassword').value;
    const strengthDiv = document.getElementById('signupPasswordStrength');
    
    if (!strengthDiv) return;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength < 3) {
        strengthDiv.textContent = 'Weak password';
        strengthDiv.className = 'password-strength strength-weak';
    } else if (strength < 4) {
        strengthDiv.textContent = 'Medium password';
        strengthDiv.className = 'password-strength strength-medium';
    } else {
        strengthDiv.textContent = 'Strong password';
        strengthDiv.className = 'password-strength strength-strong';
    }
}

// Show forgot password modal
function showForgotPassword() {
    closeAllModals();
    
    const modalHTML = `
        <div class="auth-modal" id="forgotPasswordModal">
            <div class="modal-backdrop" onclick="closeAllModals()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-key"></i> Reset Password</h2>
                    <button class="close-btn" onclick="closeAllModals()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Enter your email address and we'll send you a link to reset your password.</p>
                    
                    <form id="forgotPasswordForm">
                        <div class="form-group">
                            <label for="forgotEmail">Email Address</label>
                            <div class="input-icon">
                                <input type="email" id="forgotEmail" name="email" required>
                                <i class="fas fa-envelope"></i>
                            </div>
                        </div>

                        <button type="submit" class="btn-auth">
                            <i class="fas fa-paper-plane"></i> Send Reset Link
                        </button>
                    </form>

                    <div class="modal-links">
                        <p><a href="#" onclick="showLogin()">← Back to Login</a></p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    setTimeout(() => {
        document.getElementById('forgotEmail').focus();
    }, 100);
}

// Initialize profile dropdown
function initializeProfileDropdown() {
    const profileIcon = document.querySelector('#profileIcon');
    const profileDropdown = document.querySelector('#profileDropdown');
    
    if (profileIcon && profileDropdown) {
        profileIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
        
        // Handle logout
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
}

// Handle logout
async function handleLogout(e) {
    e.preventDefault();
    
    try {
        const response = await fetch('php/auth/logout.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.removeItem('jpgems_user');
            currentUser = null;
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Logout error:', error);
        // Force logout on error
        localStorage.removeItem('jpgems_user');
        currentUser = null;
        window.location.href = 'index.html';
    }
}

// Product data for different categories
const productData = {
    'blue-sapphires': [
        {
            id: 1,
            name: 'Premium Blue Sapphire',
            price: '$299.99',
            originalPrice: '$399.99',
            image: 'images/blue-sapphires.jpg',
            rating: 4.8,
            discount: '25% OFF'
        },
        {
            id: 2,
            name: 'Ceylon Blue Sapphire',
            price: '$459.99',
            originalPrice: '$599.99',
            image: 'images/bs1.jpg',
            rating: 4.9,
            discount: '23% OFF'
        },
        {
            id: 3,
            name: 'Royal Blue Sapphire',
            price: '$699.99',
            originalPrice: '$899.99',
            image: 'images/blue-sapphires.jpg',
            rating: 4.7,
            discount: '22% OFF'
        },
        {
            id: 4,
            name: 'Natural Blue Sapphire',
            price: '$379.99',
            originalPrice: '$479.99',
            image: 'images/bs1.jpg',
            rating: 4.6,
            discount: '21% OFF'
        },
        {
            id: 5,
            name: 'Cornflower Blue Sapphire',
            price: '$549.99',
            originalPrice: '$699.99',
            image: 'images/blue-sapphires.jpg',
            rating: 4.8,
            discount: '21% OFF'
        },
        {
            id: 6,
            name: 'Kashmir Blue Sapphire',
            price: '$899.99',
            originalPrice: '$1199.99',
            image: 'images/bs1.jpg',
            rating: 4.9,
            discount: '25% OFF'
        },
        {
            id: 7,
            name: 'Star Blue Sapphire',
            price: '$429.99',
            originalPrice: '$549.99',
            image: 'images/blue-sapphires.jpg',
            rating: 4.7,
            discount: '22% OFF'
        },
        {
            id: 8,
            name: 'Velvet Blue Sapphire',
            price: '$659.99',
            originalPrice: '$849.99',
            image: 'images/bs1.jpg',
            rating: 4.8,
            discount: '22% OFF'
        },
        {
            id: 9,
            name: 'Electric Blue Sapphire',
            price: '$749.99',
            originalPrice: '$999.99',
            image: 'images/blue-sapphires.jpg',
            rating: 4.9,
            discount: '25% OFF'
        },
        {
            id: 10,
            name: 'Teal Blue Sapphire',
            price: '$389.99',
            originalPrice: '$499.99',
            image: 'images/bs1.jpg',
            rating: 4.6,
            discount: '22% OFF'
        }
    ],
    'ruby': [
        {
            id: 11,
            name: 'Burmese Ruby',
            price: '$599.99',
            originalPrice: '$799.99',
            image: 'images/rb0.jpg',
            rating: 4.9,
            discount: '25% OFF'
        },
        {
            id: 12,
            name: 'Pigeon Blood Ruby',
            price: '$899.99',
            originalPrice: '$1199.99',
            image: 'images/rb2.jpg',
            rating: 4.9,
            discount: '25% OFF'
        },
        {
            id: 13,
            name: 'Thai Ruby',
            price: '$459.99',
            originalPrice: '$599.99',
            image: 'images/rb0.jpg',
            rating: 4.7,
            discount: '23% OFF'
        },
        {
            id: 14,
            name: 'Star Ruby',
            price: '$679.99',
            originalPrice: '$899.99',
            image: 'images/rb2.jpg',
            rating: 4.8,
            discount: '24% OFF'
        },
        {
            id: 15,
            name: 'Mozambique Ruby',
            price: '$519.99',
            originalPrice: '$699.99',
            image: 'images/rb0.jpg',
            rating: 4.7,
            discount: '26% OFF'
        },
        {
            id: 16,
            name: 'Madagascar Ruby',
            price: '$649.99',
            originalPrice: '$849.99',
            image: 'images/rb2.jpg',
            rating: 4.8,
            discount: '24% OFF'
        },
        {
            id: 17,
            name: 'Indian Ruby',
            price: '$399.99',
            originalPrice: '$529.99',
            image: 'images/rb0.jpg',
            rating: 4.6,
            discount: '25% OFF'
        },
        {
            id: 18,
            name: 'African Ruby',
            price: '$549.99',
            originalPrice: '$729.99',
            image: 'images/rb2.jpg',
            rating: 4.7,
            discount: '25% OFF'
        },
        {
            id: 19,
            name: 'Synthetic Ruby',
            price: '$199.99',
            originalPrice: '$279.99',
            image: 'images/rb0.jpg',
            rating: 4.5,
            discount: '29% OFF'
        },
        {
            id: 20,
            name: 'Cabochon Ruby',
            price: '$429.99',
            originalPrice: '$569.99',
            image: 'images/rb2.jpg',
            rating: 4.6,
            discount: '25% OFF'
        }
    ],
    'emerald': [
        {
            id: 21,
            name: 'Colombian Emerald',
            price: '$799.99',
            originalPrice: '$1099.99',
            image: 'images/img5.jpg',
            rating: 4.9,
            discount: '27% OFF'
        },
        {
            id: 22,
            name: 'Zambian Emerald',
            price: '$649.99',
            originalPrice: '$899.99',
            image: 'images/img5.jpg',
            rating: 4.8,
            discount: '28% OFF'
        },
        {
            id: 23,
            name: 'Brazilian Emerald',
            price: '$579.99',
            originalPrice: '$779.99',
            image: 'images/img5.jpg',
            rating: 4.7,
            discount: '26% OFF'
        },
        {
            id: 24,
            name: 'Ethiopian Emerald',
            price: '$459.99',
            originalPrice: '$629.99',
            image: 'images/img5.jpg',
            rating: 4.6,
            discount: '27% OFF'
        },
        {
            id: 25,
            name: 'Russian Emerald',
            price: '$699.99',
            originalPrice: '$949.99',
            image: 'images/img5.jpg',
            rating: 4.8,
            discount: '26% OFF'
        },
        {
            id: 26,
            name: 'Trapiche Emerald',
            price: '$899.99',
            originalPrice: '$1199.99',
            image: 'images/img5.jpg',
            rating: 4.9,
            discount: '25% OFF'
        },
        {
            id: 27,
            name: 'Panjshir Emerald',
            price: '$549.99',
            originalPrice: '$749.99',
            image: 'images/img5.jpg',
            rating: 4.7,
            discount: '27% OFF'
        },
        {
            id: 28,
            name: 'Muzo Emerald',
            price: '$1099.99',
            originalPrice: '$1499.99',
            image: 'images/img5.jpg',
            rating: 4.9,
            discount: '27% OFF'
        },
        {
            id: 29,
            name: 'Chivor Emerald',
            price: '$829.99',
            originalPrice: '$1129.99',
            image: 'images/img5.jpg',
            rating: 4.8,
            discount: '27% OFF'
        },
        {
            id: 30,
            name: 'Sandawana Emerald',
            price: '$399.99',
            originalPrice: '$549.99',
            image: 'images/img5.jpg',
            rating: 4.6,
            discount: '27% OFF'
        }
    ],
    'yellow-sapphire': [
        {
            id: 31,
            name: 'Ceylon Yellow Sapphire',
            price: '$449.99',
            originalPrice: '$599.99',
            image: 'images/ys0.jpg',
            rating: 4.8,
            discount: '25% OFF'
        },
        {
            id: 32,
            name: 'Bangkok Yellow Sapphire',
            price: '$369.99',
            originalPrice: '$499.99',
            image: 'images/ys2.jpg',
            rating: 4.7,
            discount: '26% OFF'
        },
        {
            id: 33,
            name: 'Australian Yellow Sapphire',
            price: '$529.99',
            originalPrice: '$719.99',
            image: 'images/ys0.jpg',
            rating: 4.8,
            discount: '26% OFF'
        },
        {
            id: 34,
            name: 'Madagascar Yellow Sapphire',
            price: '$399.99',
            originalPrice: '$549.99',
            image: 'images/ys2.jpg',
            rating: 4.7,
            discount: '27% OFF'
        },
        {
            id: 35,
            name: 'Thai Yellow Sapphire',
            price: '$329.99',
            originalPrice: '$449.99',
            image: 'images/ys0.jpg',
            rating: 4.6,
            discount: '27% OFF'
        },
        {
            id: 36,
            name: 'Canary Yellow Sapphire',
            price: '$649.99',
            originalPrice: '$879.99',
            image: 'images/ys2.jpg',
            rating: 4.9,
            discount: '26% OFF'
        },
        {
            id: 37,
            name: 'Golden Yellow Sapphire',
            price: '$579.99',
            originalPrice: '$779.99',
            image: 'images/ys0.jpg',
            rating: 4.8,
            discount: '26% OFF'
        },
        {
            id: 38,
            name: 'Lemon Yellow Sapphire',
            price: '$479.99',
            originalPrice: '$649.99',
            image: 'images/ys2.jpg',
            rating: 4.7,
            discount: '26% OFF'
        },
        {
            id: 39,
            name: 'Honey Yellow Sapphire',
            price: '$419.99',
            originalPrice: '$569.99',
            image: 'images/ys0.jpg',
            rating: 4.7,
            discount: '26% OFF'
        },
        {
            id: 40,
            name: 'Champagne Yellow Sapphire',
            price: '$359.99',
            originalPrice: '$489.99',
            image: 'images/ys2.jpg',
            rating: 4.6,
            discount: '27% OFF'
        }
    ],
    'pink-sapphire': [
        {
            id: 41,
            name: 'Pink Sapphire Elegant',
            price: '$549.99',
            originalPrice: '$749.99',
            image: 'images/ps1.jpg',
            rating: 4.8,
            discount: '27% OFF'
        },
        {
            id: 42,
            name: 'Rose Pink Sapphire',
            price: '$629.99',
            originalPrice: '$849.99',
            image: 'images/ps2.jpg',
            rating: 4.9,
            discount: '26% OFF'
        },
        {
            id: 43,
            name: 'Padparadscha Sapphire',
            price: '$899.99',
            originalPrice: '$1199.99',
            image: 'images/ps1.jpg',
            rating: 4.9,
            discount: '25% OFF'
        },
        {
            id: 44,
            name: 'Hot Pink Sapphire',
            price: '$679.99',
            originalPrice: '$919.99',
            image: 'images/ps2.jpg',
            rating: 4.8,
            discount: '26% OFF'
        },
        {
            id: 45,
            name: 'Baby Pink Sapphire',
            price: '$429.99',
            originalPrice: '$579.99',
            image: 'images/ps1.jpg',
            rating: 4.7,
            discount: '26% OFF'
        },
        {
            id: 46,
            name: 'Magenta Pink Sapphire',
            price: '$749.99',
            originalPrice: '$1019.99',
            image: 'images/ps2.jpg',
            rating: 4.8,
            discount: '26% OFF'
        },
        {
            id: 47,
            name: 'Lotus Pink Sapphire',
            price: '$599.99',
            originalPrice: '$809.99',
            image: 'images/ps1.jpg',
            rating: 4.8,
            discount: '26% OFF'
        },
        {
            id: 48,
            name: 'Bubblegum Pink Sapphire',
            price: '$519.99',
            originalPrice: '$699.99',
            image: 'images/ps2.jpg',
            rating: 4.7,
            discount: '26% OFF'
        },
        {
            id: 49,
            name: 'Coral Pink Sapphire',
            price: '$659.99',
            originalPrice: '$889.99',
            image: 'images/ps1.jpg',
            rating: 4.8,
            discount: '26% OFF'
        },
        {
            id: 50,
            name: 'Salmon Pink Sapphire',
            price: '$479.99',
            originalPrice: '$649.99',
            image: 'images/ps2.jpg',
            rating: 4.7,
            discount: '26% OFF'
        }
    ],
    'white-sapphires': [
        {
            id: 51,
            name: 'White Sapphire Classic',
            price: '$299.99',
            originalPrice: '$399.99',
            image: 'images/ws0.jpg',
            rating: 4.7,
            discount: '25% OFF'
        },
        {
            id: 52,
            name: 'Colorless White Sapphire',
            price: '$349.99',
            originalPrice: '$469.99',
            image: 'images/ws1.jpg',
            rating: 4.8,
            discount: '26% OFF'
        },
        {
            id: 53,
            name: 'Brilliant White Sapphire',
            price: '$429.99',
            originalPrice: '$579.99',
            image: 'images/ws2.jpg',
            rating: 4.8,
            discount: '26% OFF'
        },
        {
            id: 54,
            name: 'Ceylon White Sapphire',
            price: '$389.99',
            originalPrice: '$529.99',
            image: 'images/ws0.jpg',
            rating: 4.7,
            discount: '26% OFF'
        },
        {
            id: 55,
            name: 'Clear White Sapphire',
            price: '$259.99',
            originalPrice: '$349.99',
            image: 'images/ws1.jpg',
            rating: 4.6,
            discount: '26% OFF'
        },
        {
            id: 56,
            name: 'Diamond Alternative White Sapphire',
            price: '$499.99',
            originalPrice: '$679.99',
            image: 'images/ws2.jpg',
            rating: 4.9,
            discount: '26% OFF'
        },
        {
            id: 57,
            name: 'Pure White Sapphire',
            price: '$319.99',
            originalPrice: '$429.99',
            image: 'images/ws0.jpg',
            rating: 4.7,
            discount: '26% OFF'
        },
        {
            id: 58,
            name: 'Crystal White Sapphire',
            price: '$369.99',
            originalPrice: '$499.99',
            image: 'images/ws1.jpg',
            rating: 4.7,
            discount: '26% OFF'
        },
        {
            id: 59,
            name: 'Ice White Sapphire',
            price: '$279.99',
            originalPrice: '$379.99',
            image: 'images/ws2.jpg',
            rating: 4.6,
            discount: '26% OFF'
        },
        {
            id: 60,
            name: 'Platinum White Sapphire',
            price: '$449.99',
            originalPrice: '$609.99',
            image: 'images/ws0.jpg',
            rating: 4.8,
            discount: '26% OFF'
        }
    ],
    'diamonds': [
        {
            id: 61,
            name: 'Premium Diamond',
            price: '$1299.99',
            originalPrice: '$1699.99',
            image: 'images/pd0.jpg',
            rating: 4.9,
            discount: '24% OFF'
        },
        {
            id: 62,
            name: 'Round Brilliant Diamond',
            price: '$1599.99',
            originalPrice: '$2099.99',
            image: 'images/pd1.jpg',
            rating: 4.9,
            discount: '24% OFF'
        },
        {
            id: 63,
            name: 'Princess Cut Diamond',
            price: '$1199.99',
            originalPrice: '$1599.99',
            image: 'images/pd0.jpg',
            rating: 4.8,
            discount: '25% OFF'
        },
        {
            id: 64,
            name: 'Emerald Cut Diamond',
            price: '$1399.99',
            originalPrice: '$1859.99',
            image: 'images/pd1.jpg',
            rating: 4.8,
            discount: '25% OFF'
        },
        {
            id: 65,
            name: 'Cushion Cut Diamond',
            price: '$1099.99',
            originalPrice: '$1459.99',
            image: 'images/pd0.jpg',
            rating: 4.7,
            discount: '25% OFF'
        },
        {
            id: 66,
            name: 'Oval Diamond',
            price: '$1249.99',
            originalPrice: '$1669.99',
            image: 'images/pd1.jpg',
            rating: 4.8,
            discount: '25% OFF'
        },
        {
            id: 67,
            name: 'Marquise Diamond',
            price: '$1349.99',
            originalPrice: '$1799.99',
            image: 'images/pd0.jpg',
            rating: 4.8,
            discount: '25% OFF'
        },
        {
            id: 68,
            name: 'Pear Shape Diamond',
            price: '$1179.99',
            originalPrice: '$1579.99',
            image: 'images/pd1.jpg',
            rating: 4.7,
            discount: '25% OFF'
        },
        {
            id: 69,
            name: 'Heart Shape Diamond',
            price: '$1449.99',
            originalPrice: '$1939.99',
            image: 'images/pd0.jpg',
            rating: 4.9,
            discount: '25% OFF'
        },
        {
            id: 70,
            name: 'Radiant Cut Diamond',
            price: '$1129.99',
            originalPrice: '$1509.99',
            image: 'images/pd1.jpg',
            rating: 4.7,
            discount: '25% OFF'
        }
    ],
    'garnet': [
        {
            id: 71,
            name: 'Natural Garnet',
            price: '$159.99',
            originalPrice: '$219.99',
            image: 'images/img3.jpg',
            rating: 4.6,
            discount: '27% OFF'
        },
        {
            id: 72,
            name: 'Almandine Garnet',
            price: '$189.99',
            originalPrice: '$259.99',
            image: 'images/img3.jpg',
            rating: 4.7,
            discount: '27% OFF'
        },
        {
            id: 73,
            name: 'Pyrope Garnet',
            price: '$229.99',
            originalPrice: '$309.99',
            image: 'images/img3.jpg',
            rating: 4.7,
            discount: '26% OFF'
        },
        {
            id: 74,
            name: 'Spessartine Garnet',
            price: '$349.99',
            originalPrice: '$469.99',
            image: 'images/img3.jpg',
            rating: 4.8,
            discount: '26% OFF'
        },
        {
            id: 75,
            name: 'Tsavorite Garnet',
            price: '$599.99',
            originalPrice: '$799.99',
            image: 'images/img3.jpg',
            rating: 4.9,
            discount: '25% OFF'
        },
        {
            id: 76,
            name: 'Rhodolite Garnet',
            price: '$279.99',
            originalPrice: '$379.99',
            image: 'images/img3.jpg',
            rating: 4.7,
            discount: '26% OFF'
        },
        {
            id: 77,
            name: 'Grossular Garnet',
            price: '$319.99',
            originalPrice: '$429.99',
            image: 'images/img3.jpg',
            rating: 4.7,
            discount: '26% OFF'
        },
        {
            id: 78,
            name: 'Andradite Garnet',
            price: '$399.99',
            originalPrice: '$529.99',
            image: 'images/img3.jpg',
            rating: 4.8,
            discount: '25% OFF'
        },
        {
            id: 79,
            name: 'Demantoid Garnet',
            price: '$899.99',
            originalPrice: '$1199.99',
            image: 'images/img3.jpg',
            rating: 4.9,
            discount: '25% OFF'
        },
        {
            id: 80,
            name: 'Uvarovite Garnet',
            price: '$729.99',
            originalPrice: '$979.99',
            image: 'images/img3.jpg',
            rating: 4.8,
            discount: '26% OFF'
        }
    ],
    'opals': [
        {
            id: 81,
            name: 'Australian Opal',
            price: '$299.99',
            originalPrice: '$399.99',
            image: 'images/img4.jpg',
            rating: 4.7,
            discount: '25% OFF'
        },
        {
            id: 82,
            name: 'Boulder Opal',
            price: '$449.99',
            originalPrice: '$599.99',
            image: 'images/img4.jpg',
            rating: 4.8,
            discount: '25% OFF'
        },
        {
            id: 83,
            name: 'Black Opal',
            price: '$899.99',
            originalPrice: '$1199.99',
            image: 'images/img4.jpg',
            rating: 4.9,
            discount: '25% OFF'
        },
        {
            id: 84,
            name: 'White Opal',
            price: '$199.99',
            originalPrice: '$269.99',
            image: 'images/img4.jpg',
            rating: 4.6,
            discount: '26% OFF'
        },
        {
            id: 85,
            name: 'Crystal Opal',
            price: '$349.99',
            originalPrice: '$469.99',
            image: 'images/img4.jpg',
            rating: 4.7,
            discount: '26% OFF'
        },
        {
            id: 86,
            name: 'Fire Opal',
            price: '$279.99',
            originalPrice: '$379.99',
            image: 'images/img4.jpg',
            rating: 4.7,
            discount: '26% OFF'
        },
        {
            id: 87,
            name: 'Ethiopian Opal',
            price: '$159.99',
            originalPrice: '$219.99',
            image: 'images/img4.jpg',
            rating: 4.5,
            discount: '27% OFF'
        },
        {
            id: 88,
            name: 'Matrix Opal',
            price: '$549.99',
            originalPrice: '$739.99',
            image: 'images/img4.jpg',
            rating: 4.8,
            discount: '26% OFF'
        },
        {
            id: 89,
            name: 'Doublet Opal',
            price: '$229.99',
            originalPrice: '$309.99',
            image: 'images/img4.jpg',
            rating: 4.6,
            discount: '26% OFF'
        },
        {
            id: 90,
            name: 'Triplet Opal',
            price: '$129.99',
            originalPrice: '$179.99',
            image: 'images/img4.jpg',
            rating: 4.4,
            discount: '28% OFF'
        }
    ],
    'zircon': [
        {
            id: 91,
            name: 'Blue Zircon',
            price: '$249.99',
            originalPrice: '$329.99',
            image: 'images/img6.jpg',
            rating: 4.7,
            discount: '24% OFF'
        },
        {
            id: 92,
            name: 'Colorless Zircon',
            price: '$199.99',
            originalPrice: '$269.99',
            image: 'images/img6.jpg',
            rating: 4.6,
            discount: '26% OFF'
        },
        {
            id: 93,
            name: 'Yellow Zircon',
            price: '$179.99',
            originalPrice: '$239.99',
            image: 'images/img6.jpg',
            rating: 4.6,
            discount: '25% OFF'
        },
        {
            id: 94,
            name: 'Brown Zircon',
            price: '$149.99',
            originalPrice: '$199.99',
            image: 'images/img6.jpg',
            rating: 4.5,
            discount: '25% OFF'
        },
        {
            id: 95,
            name: 'Green Zircon',
            price: '$329.99',
            originalPrice: '$439.99',
            image: 'images/img6.jpg',
            rating: 4.7,
            discount: '25% OFF'
        },
        {
            id: 96,
            name: 'Red Zircon',
            price: '$399.99',
            originalPrice: '$529.99',
            image: 'images/img6.jpg',
            rating: 4.8,
            discount: '25% OFF'
        },
        {
            id: 97,
            name: 'Orange Zircon',
            price: '$269.99',
            originalPrice: '$359.99',
            image: 'images/img6.jpg',
            rating: 4.6,
            discount: '25% OFF'
        },
        {
            id: 98,
            name: 'Pink Zircon',
            price: '$349.99',
            originalPrice: '$469.99',
            image: 'images/img6.jpg',
            rating: 4.7,
            discount: '26% OFF'
        },
        {
            id: 99,
            name: 'Purple Zircon',
            price: '$429.99',
            originalPrice: '$579.99',
            image: 'images/img6.jpg',
            rating: 4.8,
            discount: '26% OFF'
        },
        {
            id: 100,
            name: 'Champagne Zircon',
            price: '$219.99',
            originalPrice: '$299.99',
            image: 'images/img6.jpg',
            rating: 4.6,
            discount: '27% OFF'
        }
    ],
    'star-sapphire': [
        {
            id: 101,
            name: 'Blue Star Sapphire',
            price: '$599.99',
            originalPrice: '$799.99',
            image: 'images/img7.jpg',
            rating: 4.8,
            discount: '25% OFF'
        },
        {
            id: 102,
            name: 'Grey Star Sapphire',
            price: '$449.99',
            originalPrice: '$599.99',
            image: 'images/img7.jpg',
            rating: 4.7,
            discount: '25% OFF'
        },
        {
            id: 103,
            name: 'Pink Star Sapphire',
            price: '$749.99',
            originalPrice: '$999.99',
            image: 'images/img7.jpg',
            rating: 4.8,
            discount: '25% OFF'
        },
        {
            id: 104,
            name: 'Black Star Sapphire',
            price: '$399.99',
            originalPrice: '$529.99',
            image: 'images/img7.jpg',
            rating: 4.7,
            discount: '25% OFF'
        },
        {
            id: 105,
            name: 'White Star Sapphire',
            price: '$329.99',
            originalPrice: '$439.99',
            image: 'images/img7.jpg',
            rating: 4.6,
            discount: '25% OFF'
        },
        {
            id: 106,
            name: 'Golden Star Sapphire',
            price: '$679.99',
            originalPrice: '$909.99',
            image: 'images/img7.jpg',
            rating: 4.8,
            discount: '25% OFF'
        },
        {
            id: 107,
            name: 'Purple Star Sapphire',
            price: '$529.99',
            originalPrice: '$709.99',
            image: 'images/img7.jpg',
            rating: 4.7,
            discount: '25% OFF'
        },
        {
            id: 108,
            name: 'Orange Star Sapphire',
            price: '$619.99',
            originalPrice: '$829.99',
            image: 'images/img7.jpg',
            rating: 4.8,
            discount: '25% OFF'
        },
        {
            id: 109,
            name: 'Green Star Sapphire',
            price: '$549.99',
            originalPrice: '$739.99',
            image: 'images/img7.jpg',
            rating: 4.7,
            discount: '26% OFF'
        },
        {
            id: 110,
            name: 'Padparadscha Star Sapphire',
            price: '$899.99',
            originalPrice: '$1199.99',
            image: 'images/img7.jpg',
            rating: 4.9,
            discount: '25% OFF'
        }
    ]
};

// Generate product cards
function generateProducts() {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const productContainer = document.querySelector('.product-grid');
    
    if (!productContainer) return;
    
    const categoryProducts = productData[currentPage] || [];
    
    if (categoryProducts.length === 0) return;
    
    productContainer.innerHTML = '';
    
    categoryProducts.forEach(product => {
        const productCard = createProductCard(product);
        productContainer.appendChild(productCard);
    });
}

// Create individual product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.cursor = 'pointer';
    
    // Add click event to entire card
    card.addEventListener('click', function(e) {
        // Don't trigger if clicking on buttons
        if (!e.target.closest('button')) {
            viewProduct(product.id);
        }
    });
    
    card.innerHTML = `
        <div class="product-image">
            <img src="../${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-name-overlay">
                <h3 class="product-name">${product.name}</h3>
            </div>
        </div>
        <div class="product-details">
            <div class="product-rating">
                ${generateStars(product.rating)}
                <span class="rating-text">(${product.rating})</span>
            </div>
            <div class="product-prices">
                <span class="current-price">${product.price}</span>
                <span class="original-price">${product.originalPrice}</span>
            </div>
            <div class="product-actions">
                <button class="action-btn wishlist-btn" title="Add to Wishlist">
                    <i class="far fa-heart"></i>
                </button>
                <button class="action-btn view-btn" title="Quick View" onclick="viewProduct(${product.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})" title="Add to Cart">
                    <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

// View product details
function viewProduct(productId) {
    // Store product ID in localStorage for itemdetails page
    localStorage.setItem('selectedProductId', productId);
    
    // Check if we're in a subdirectory (like html folder)
    const currentPage = window.location.pathname;
    if (currentPage.includes('/html/')) {
        // We're in html folder, so itemdetails.html is in same folder
        window.location.href = 'itemdetails.html';
    } else {
        // We're in root, so navigate to html folder
        window.location.href = 'html/itemdetails.html';
    }
}

// Add to cart function
function addToCart(productId) {
    if (!currentUser) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }
    
    // Add cart functionality here
    console.log('Adding product', productId, 'to cart');
    alert('Product added to cart!');
}

// Initialize hero slider for homepage
function initializeSlider() {
    const heroSection = document.querySelector('.hero');
    const images = document.querySelectorAll('.hero img');
    const texts = document.querySelectorAll('.hero-text');
    const indicators = document.querySelectorAll('.hero-indicators .indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!heroSection || images.length === 0) return;
    
    let currentSlide = 0;
    const slideCount = images.length;
    let autoSlideInterval;
    
    function showSlide(index) {
        // Hide all images, texts, and indicators
        images.forEach((img, i) => {
            img.classList.remove('active');
        });
        
        texts.forEach((text, i) => {
            text.classList.remove('active');
        });
        
        indicators.forEach((indicator, i) => {
            indicator.classList.remove('active');
        });
        
        // Show current image, text, and indicator
        if (images[index]) {
            images[index].classList.add('active');
        }
        
        if (texts[index]) {
            texts[index].classList.add('active');
        }
        
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slideCount;
        showSlide(nextIndex);
    }
    
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slideCount) % slideCount;
        showSlide(prevIndex);
    }
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Event listeners for navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide(); // Restart auto slide
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide(); // Restart auto slide
        });
    }
    
    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide(); // Restart auto slide
        });
    });
    
    // Pause auto slide on hover
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopAutoSlide);
        heroSection.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        } else if (e.key === 'ArrowRight') {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        }
    });
    
    // Initialize
    showSlide(0);
    startAutoSlide();
}

// Generate categories for homepage
// Generate categories from backend API
async function generateCategories() {
    console.log('generateCategories function called');
    const categoryContainer = document.querySelector('#category-container');
    console.log('categoryContainer found:', categoryContainer);
    
    if (!categoryContainer) {
        console.log('categoryContainer not found - returning');
        return;
    }
    
    try {
        // Show loading state
        categoryContainer.innerHTML = '<div class="loading-state">Loading gemstones...</div>';
        
        // Fetch categories from backend API
        const response = await fetch('api/categories.php?action=categories');
        const result = await response.json();
        
        if (result.success && result.data) {
            displayCategories(result.data, categoryContainer);
        } else {
            // Fallback to static categories if API fails
            console.log('API failed, using fallback categories');
            displayFallbackCategories(categoryContainer);
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to static categories
        displayFallbackCategories(categoryContainer);
    }
}

// Display categories from API
function displayCategories(categories, container) {
    console.log('Displaying categories from API:', categories);
    container.innerHTML = '';
    
    categories.forEach((category, index) => {
        console.log(`Creating category ${index + 1}:`, category.name);
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        
        categoryCard.innerHTML = `
            <a href="${category.link}" class="category-link">
                <div class="category-image">
                    <img src="${category.image}" alt="${category.name}" loading="lazy" onerror="this.src='images/placeholder.jpg'">
                    <div class="category-overlay">
                        <div class="category-content">
                            <h3>${category.name}</h3>
                        </div>
                    </div>
                </div>
            </a>
        `;
        
        container.appendChild(categoryCard);
        console.log(`Appended category ${index + 1} to container`);
    });
    
    console.log('All categories generated from API. Total cards:', container.children.length);
}

// Fallback categories if API is not available
function displayFallbackCategories(container) {
    const categories = [
        {
            name: 'Blue Sapphires',
            image: 'images/blue-sapphires.jpg',
            link: 'html/blue-sapphires.html',
            description: 'Stunning blue sapphires with brilliant clarity'
        },
        {
            name: 'Rubies',
            image: 'images/rb0.jpg',
            link: 'html/ruby.html',
            description: 'Premium quality rubies with deep red color'
        },
        {
            name: 'Emeralds',
            image: 'images/img2.jpg',
            link: 'html/emerald.html',
            description: 'Beautiful emeralds with vibrant green hues'
        },
        {
            name: 'Yellow Sapphires',
            image: 'images/ys0.jpg',
            link: 'html/yellow-sapphire.html',
            description: 'Bright yellow sapphires with excellent clarity'
        },
        {
            name: 'Padparadscha',
            image: 'images/pis0.jpg',
            link: 'html/pink-sapphire.html',
            description: 'Rare padparadscha sapphires with peach-pink hues'
        },
        {
            name: 'Teal Sapphires',
            image: 'images/ws0.jpg',
            link: 'html/white-sapphires.html',
            description: 'Unique teal sapphires with blue-green coloring'
        },
        {
            name: 'Diamonds',
            image: 'images/pd0.jpg',
            link: 'html/diamonds.html',
            description: 'Premium diamonds with exceptional cut and clarity'
        },
        {
            name: 'Garnets',
            image: 'images/img3.jpg',
            link: 'html/garnet.html',
            description: 'Rich red garnets with excellent fire'
        },
        {
            name: 'Opals',
            image: 'images/img4.jpg',
            link: 'html/opals.html',
            description: 'Beautiful opals with stunning play of color'
        },
        {
            name: 'Zircons',
            image: 'images/img6.jpg',
            link: 'html/zircon.html',
            description: 'Brilliant zircons with high refractive index'
        },
        {
            name: 'Star Sapphires',
            image: 'images/img7.jpg',
            link: 'html/star-sapphire.html',
            description: 'Rare star sapphires with unique asterism'
        },
        {
            name: 'Tourmaline',
            image: 'images/img8.jpg',
            link: 'html/emerald.html',
            description: 'Beautiful tourmaline with multicolor brilliance'
        }
    ];
    
    console.log('Using fallback categories:', categories);
    container.innerHTML = '';
    
    categories.forEach((category, index) => {
        console.log(`Creating fallback category ${index + 1}:`, category.name);
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        
        categoryCard.innerHTML = `
            <a href="${category.link}" class="category-link">
                <div class="category-image">
                    <img src="${category.image}" alt="${category.name}" loading="lazy" onerror="this.src='images/placeholder.jpg'">
                    <div class="category-overlay">
                        <div class="category-content">
                            <h3>${category.name}</h3>
                        </div>
                    </div>
                </div>
            </a>
        `;
        
        container.appendChild(categoryCard);
        console.log(`Appended fallback category ${index + 1} to container`);
    });
    
    console.log('All fallback categories generated. Total cards:', container.children.length);
}

// Modal Functions for Login/Signup
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Close profile dropdown if open
        const profileDropdown = document.getElementById('profileDropdown');
        if (profileDropdown) {
            profileDropdown.classList.remove('show');
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Clear form data
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
        
        // Clear messages
        const errorMessage = modal.querySelector('.modal-error-message');
        const successMessage = modal.querySelector('.modal-success-message');
        if (errorMessage) errorMessage.style.display = 'none';
        if (successMessage) successMessage.style.display = 'none';
    }
}

function switchToSignup() {
    closeModal('loginModal');
    setTimeout(() => openModal('signupModal'), 300);
}

function switchToLogin() {
    closeModal('signupModal');
    setTimeout(() => openModal('loginModal'), 300);
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('auth-modal')) {
        const modalId = e.target.id;
        closeModal(modalId);
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.auth-modal.show');
        if (openModal) {
            closeModal(openModal.id);
        }
    }
});

// Modal Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('modalLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('modalLoginEmail').value;
            const password = document.getElementById('modalLoginPassword').value;
            const remember = document.getElementById('modalLoginRemember').checked;
            
            const errorDiv = document.getElementById('loginErrorMessage');
            const successDiv = document.getElementById('loginSuccessMessage');
            
            // Hide previous messages
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';
            
            try {
                const response = await fetch('php/auth/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        remember: remember
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    successDiv.textContent = 'Login successful! Welcome back!';
                    successDiv.style.display = 'block';
                    
                    // Store user session
                    localStorage.setItem('userToken', data.token);
                    localStorage.setItem('userData', JSON.stringify(data.user));
                    
                    // Close modal after 1 second
                    setTimeout(() => {
                        closeModal('loginModal');
                        location.reload(); // Refresh to update UI
                    }, 1000);
                } else {
                    errorDiv.textContent = data.message || 'Login failed. Please try again.';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                errorDiv.textContent = 'Network error. Please try again.';
                errorDiv.style.display = 'block';
            }
        });
    }
    
    // Modal Signup Form Handler
    const signupForm = document.getElementById('modalSignupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('modalSignupFirstName').value;
            const lastName = document.getElementById('modalSignupLastName').value;
            const email = document.getElementById('modalSignupEmail').value;
            const phone = document.getElementById('modalSignupPhone').value;
            const password = document.getElementById('modalSignupPassword').value;
            const confirmPassword = document.getElementById('modalSignupConfirmPassword').value;
            const terms = document.getElementById('modalSignupTerms').checked;
            const newsletter = document.getElementById('modalSignupNewsletter').checked;
            
            const errorDiv = document.getElementById('signupErrorMessage');
            const successDiv = document.getElementById('signupSuccessMessage');
            
            // Hide previous messages
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';
            
            // Validation
            if (password !== confirmPassword) {
                errorDiv.textContent = 'Passwords do not match.';
                errorDiv.style.display = 'block';
                return;
            }
            
            if (!terms) {
                errorDiv.textContent = 'Please accept the Terms & Conditions.';
                errorDiv.style.display = 'block';
                return;
            }
            
            try {
                const response = await fetch('php/auth/signup.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        phone: phone,
                        password: password,
                        terms: terms,
                        newsletter: newsletter
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    successDiv.textContent = 'Account created successfully! Please login.';
                    successDiv.style.display = 'block';
                    
                    // Switch to login modal after 2 seconds
                    setTimeout(() => {
                        switchToLogin();
                    }, 2000);
                } else {
                    errorDiv.textContent = data.message || 'Registration failed. Please try again.';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                errorDiv.textContent = 'Network error. Please try again.';
                errorDiv.style.display = 'block';
            }
        });
    }
});

// Social Login Functions (Placeholder)
function loginWithGoogle() {
    const successDiv = document.getElementById('loginErrorMessage');
    if (successDiv) {
        successDiv.textContent = 'Google login coming soon!';
        successDiv.style.display = 'block';
    }
}

function loginWithFacebook() {
    const successDiv = document.getElementById('loginErrorMessage');
    if (successDiv) {
        successDiv.textContent = 'Facebook login coming soon!';
        successDiv.style.display = 'block';
    }
}

function signupWithGoogle() {
    const successDiv = document.getElementById('signupErrorMessage');
    if (successDiv) {
        successDiv.textContent = 'Google signup coming soon!';
        successDiv.style.display = 'block';
    }
}

function signupWithFacebook() {
    const successDiv = document.getElementById('signupErrorMessage');
    if (successDiv) {
        successDiv.textContent = 'Facebook signup coming soon!';
        successDiv.style.display = 'block';
    }
}



