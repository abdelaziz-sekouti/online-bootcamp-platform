// Authentication functions
let currentUser = null;

// Listen for auth state changes
auth.onAuthStateChanged(user => {
    currentUser = user;
    updateUI(user);
    
    if (user) {
        // User is signed in
        loadUserData(user);
    } else {
        // User is signed out
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'index.html';
        }
    }
});

// Update UI based on authentication state
function updateUI(user) {
    const user-info = document.getElementById('user-info');
    const auth-buttons = document.getElementById('auth-buttons');
    const user-name = document.getElementById('user-name');
    const welcome-name = document.getElementById('welcome-name');
    
    if (user) {
        const displayName = user.displayName || user.email.split('@')[0];
        
        if (user-info) user-info.classList.remove('hidden');
        if (auth-buttons) auth-buttons.classList.add('hidden');
        if (user-name) user-name.textContent = displayName;
        if (welcome-name) welcome-name.textContent = displayName;
    } else {
        if (user-info) user-info.classList.add('hidden');
        if (auth-buttons) auth-buttons.classList.remove('hidden');
    }
}

// Show login modal
function showLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('signupModal').classList.add('hidden');
}

// Show signup modal
function showSignupModal() {
    document.getElementById('signupModal').classList.remove('hidden');
    document.getElementById('loginModal').classList.add('hidden');
}

// Switch to signup
function switchToSignup() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('signupModal').classList.remove('hidden');
}

// Switch to login
function switchToLogin() {
    document.getElementById('signupModal').classList.add('hidden');
    document.getElementById('loginModal').classList.remove('hidden');
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        closeModal('loginModal');
        showMessage('Login successful!', 'success');
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Handle signup
async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password should be at least 6 characters!', 'error');
        return;
    }
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });
        
        // Create user document in Firestore
        await usersCollection.doc(userCredential.user.uid).set({
            name: name,
            email: email,
            enrolledCourses: [],
            completedCourses: [],
            progress: {},
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        closeModal('signupModal');
        showMessage('Account created successfully!', 'success');
        
        // Redirect to dashboard after successful signup
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Handle logout
async function logout() {
    try {
        await auth.signOut();
        showMessage('Logged out successfully!', 'success');
        
        // Redirect to home page
        if (!window.location.pathname.includes('index.html')) {
            window.location.href = 'index.html';
        }
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Load user data
async function loadUserData(user) {
    try {
        const userDoc = await usersCollection.doc(user.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            // Update UI with user data
            if (window.location.pathname.includes('dashboard.html')) {
                loadDashboardData(userData);
            }
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Load dashboard data
async function loadDashboardData(userData) {
    // This will be implemented in dashboard.js
    if (typeof loadDashboard === 'function') {
        loadDashboard(userData);
    }
}

// Show message
function showMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    const messageDiv = document.createElement('div');
    
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    messageDiv.className = `${bgColor} text-white px-6 py-4 rounded-lg shadow-lg mb-4 flex items-center transform transition-all duration-300 translate-x-full`;
    messageDiv.innerHTML = `
        <i class="fas ${icon} mr-3"></i>
        <span>${message}</span>
    `;
    
    messageContainer.appendChild(messageDiv);
    
    // Animate in
    setTimeout(() => {
        messageDiv.classList.remove('translate-x-full');
        messageDiv.classList.add('translate-x-0');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.classList.add('translate-x-full');
        setTimeout(() => {
            messageContainer.removeChild(messageDiv);
        }, 300);
    }, 5000);
}

// Google Sign In (optional feature)
async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
        showMessage('Google sign-in successful!', 'success');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Password reset
async function resetPassword(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        showMessage('Password reset email sent!', 'success');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Initialize authentication when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is on dashboard without being logged in
    if (window.location.pathname.includes('dashboard.html') && !isAuthenticated()) {
        window.location.href = 'index.html';
    }
});