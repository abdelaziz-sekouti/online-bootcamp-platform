// Main JavaScript file for the landing page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    window.toggleMobileMenu = function() {
        const mobileMenu = document.getElementById('mobileMenu');
        mobileMenu.classList.toggle('hidden');
    };

    // Enroll in course function
    window.enrollCourse = function(courseName) {
        if (typeof isAuthenticated !== 'undefined' && isAuthenticated()) {
            // User is logged in, proceed with enrollment
            enrollInCourse(courseName);
        } else {
            // User is not logged in, show login modal
            showLoginModal();
            showMessage('Please login to enroll in courses', 'info');
        }
    };

    // Handle contact form
    window.handleContactForm = function(event) {
        event.preventDefault();
        
        // Get form data
        const formData = new FormData(event.target);
        const name = formData.get('name') || event.target.querySelector('input[type="text"]').value;
        const email = formData.get('email') || event.target.querySelector('input[type="email"]').value;
        const message = formData.get('message') || event.target.querySelector('textarea').value;
        
        // Here you would normally send the data to a server
        // For now, we'll just show a success message
        showMessage('Thank you for your message! We will get back to you soon.', 'success');
        
        // Reset the form
        event.target.reset();
    };

    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('shadow-xl');
        } else {
            header.classList.remove('shadow-xl');
        }
    });

    // Initialize tooltips if needed
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'absolute bg-gray-800 text-white text-xs rounded px-2 py-1 -top-8 left-1/2 transform -translate-x-1/2';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.id = 'tooltip';
            this.appendChild(tooltip);
        });

        element.addEventListener('mouseleave', function() {
            const tooltip = document.getElementById('tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });

    // Add loading animation for buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('no-loading')) {
                const originalContent = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Loading...';
                this.disabled = true;
                
                // Reset after 2 seconds (in real app, this would be based on actual operation completion)
                setTimeout(() => {
                    this.innerHTML = originalContent;
                    this.disabled = false;
                }, 2000);
            }
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('#home');
        if (heroSection) {
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});

// Course enrollment function
async function enrollInCourse(courseName) {
    const user = getCurrentUser();
    if (!user) {
        showMessage('Please login to enroll in courses', 'info');
        return;
    }

    try {
        // Add course to user's enrolled courses
        await usersCollection.doc(user.uid).update({
            enrolledCourses: firebase.firestore.FieldValue.arrayUnion(courseName)
        });

        // Initialize progress for this course
        await progressCollection.doc(user.uid).set({
            [courseName]: {
                startedAt: firebase.firestore.FieldValue.serverTimestamp(),
                completedLessons: [],
                totalLessons: getTotalLessons(courseName),
                progressPercentage: 0
            }
        }, { merge: true });

        showMessage(`Successfully enrolled in ${courseName}!`, 'success');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } catch (error) {
        console.error('Error enrolling in course:', error);
        showMessage('Error enrolling in course. Please try again.', 'error');
    }
}

// Get total lessons for a course (this would normally come from your course data)
function getTotalLessons(courseName) {
    const courseLessons = {
        'HTML & CSS Fundamentals': 24,
        'JavaScript & DOM': 30,
        'React Development': 36,
        'Node.js & Express': 30,
        'Vue.js Development': 24,
        'Full Stack Mastery': 72
    };
    return courseLessons[courseName] || 20;
}

// Add custom styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-fadeIn {
        animation: fadeIn 0.6s ease-out;
    }
    
    .hover-scale {
        transition: transform 0.3s ease;
    }
    
    .hover-scale:hover {
        transform: scale(1.05);
    }
    
    .gradient-text {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
`;
document.head.appendChild(style);