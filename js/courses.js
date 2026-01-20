// Courses page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Filter courses
    window.filterCourses = function (level) {
        const courseCards = document.querySelectorAll('.course-card');
        const filterButtons = document.querySelectorAll('.filter-btn');

        // Update active button style
        filterButtons.forEach(btn => {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        });

        event.target.classList.remove('bg-gray-200', 'text-gray-700');
        event.target.classList.add('bg-blue-600', 'text-white');

        // Filter courses
        courseCards.forEach(card => {
            const cardLevel = card.getAttribute('data-level');

            if (level === 'all' || cardLevel === level) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    };

    // View course details
    window.viewCourseDetails = function (courseId) {
        const courseData = getCourseData(courseId);
        if (courseData) {
            displayCourseModal(courseData);
        }
    };

    // Get course data
    function getCourseData(courseId) {
        const courses = {
            'html-css': {
                title: 'HTML & CSS Fundamentals',
                level: 'Beginner',
                duration: '8 weeks',
                lessons: 24,
                projects: 3,
                description: 'Master the foundation of web development with semantic HTML5 and modern CSS3 including Flexbox and Grid.',
                topics: [
                    'HTML5 Semantic Elements',
                    'CSS3 Advanced Selectors',
                    'Flexbox Layout System',
                    'CSS Grid Layout',
                    'Responsive Design',
                    'CSS Animations & Transitions',
                    'Mobile-First Design',
                    'Cross-Browser Compatibility'
                ],
                projects: [
                    {
                        name: 'Landing Page',
                        description: 'Create a responsive landing page for a fictional company',
                        technologies: ['HTML5', 'CSS3', 'Flexbox']
                    },
                    {
                        name: 'Portfolio Website',
                        description: 'Build a personal portfolio website to showcase your work',
                        technologies: ['HTML5', 'CSS3', 'Grid', 'Animations']
                    },
                    {
                        name: 'Blog Layout',
                        description: 'Design and implement a modern blog layout',
                        technologies: ['HTML5', 'CSS3', 'Responsive Design']
                    }
                ]
            },
            'javascript': {
                title: 'JavaScript & DOM',
                level: 'Intermediate',
                duration: '10 weeks',
                lessons: 30,
                projects: 4,
                description: 'Dive deep into JavaScript programming and learn to create interactive, dynamic web applications.',
                topics: [
                    'JavaScript Fundamentals',
                    'DOM Manipulation',
                    'Event Handling',
                    'Async Programming',
                    'ES6+ Features',
                    'Array Methods & Functions',
                    'Error Handling',
                    'Local Storage & Session Storage'
                ],
                projects: [
                    {
                        name: 'To-Do App',
                        description: 'Build a functional to-do list application',
                        technologies: ['JavaScript', 'DOM', 'Local Storage']
                    },
                    {
                        name: 'Weather App',
                        description: 'Create a weather application using API data',
                        technologies: ['JavaScript', 'API', 'Async/Await']
                    },
                    {
                        name: 'Interactive Quiz',
                        description: 'Develop an interactive quiz application',
                        technologies: ['JavaScript', 'DOM', 'Event Handling']
                    },
                    {
                        name: 'Calculator',
                        description: 'Build a fully functional calculator',
                        technologies: ['JavaScript', 'DOM', 'Event Handling']
                    }
                ]
            },
            'react': {
                title: 'React Development',
                level: 'Advanced',
                duration: '12 weeks',
                lessons: 36,
                projects: 5,
                description: 'Build modern single-page applications with React, Redux, and the React ecosystem.',
                topics: [
                    'React Components',
                    'JSX Syntax',
                    'State & Props',
                    'React Hooks',
                    'React Router',
                    'Context API',
                    'Redux & Redux Toolkit',
                    'React Testing'
                ],
                projects: [
                    {
                        name: 'Task Manager',
                        description: 'Create a task management application with React',
                        technologies: ['React', 'Hooks', 'State Management']
                    },
                    {
                        name: 'E-commerce Store',
                        description: 'Build a fully functional e-commerce application',
                        technologies: ['React', 'Router', 'Context']
                    },
                    {
                        name: 'Social Media Dashboard',
                        description: 'Develop a dashboard for social media analytics',
                        technologies: ['React', 'Charts', 'API']
                    },
                    {
                        name: 'Real-time Chat App',
                        description: 'Create a real-time chat application',
                        technologies: ['React', 'WebSockets', 'Firebase']
                    },
                    {
                        name: 'Project Management Tool',
                        description: 'Build a comprehensive project management tool',
                        technologies: ['React', 'Redux', 'Testing']
                    }
                ]
            },
            'nodejs': {
                title: 'Node.js & Express',
                level: 'Advanced',
                duration: '10 weeks',
                lessons: 30,
                projects: 4,
                description: 'Build scalable backend applications with Node.js, Express, and MongoDB database.',
                topics: [
                    'Node.js Fundamentals',
                    'Express.js Framework',
                    'RESTful APIs',
                    'MongoDB Integration',
                    'Authentication & Authorization',
                    'Error Handling',
                    'Testing Node.js Apps',
                    'Deployment & DevOps'
                ],
                projects: [
                    {
                        name: 'REST API',
                        description: 'Create a RESTful API for a blog platform',
                        technologies: ['Node.js', 'Express', 'MongoDB']
                    },
                    {
                        name: 'Authentication System',
                        description: 'Build a complete authentication system',
                        technologies: ['Node.js', 'JWT', 'bcrypt']
                    },
                    {
                        name: 'File Upload Service',
                        description: 'Develop a file upload and management service',
                        technologies: ['Node.js', 'Multer', 'Cloud Storage']
                    },
                    {
                        name: 'Real-time Backend',
                        description: 'Create a real-time backend with WebSockets',
                        technologies: ['Node.js', 'Socket.io', 'Redis']
                    }
                ]
            },
            'vue': {
                title: 'Vue.js Development',
                level: 'Intermediate',
                duration: '8 weeks',
                lessons: 24,
                projects: 3,
                description: 'Learn Vue.js 3 and build progressive web applications with this intuitive framework.',
                topics: [
                    'Vue.js 3 Fundamentals',
                    'Composition API',
                    'Vue Router',
                    'Pinia State Management',
                    'Vue Components',
                    'Directives & Custom Directives',
                    'Vue Ecosystem',
                    'Performance Optimization'
                ],
                projects: [
                    {
                        name: 'Weather Dashboard',
                        description: 'Create a weather dashboard with Vue.js',
                        technologies: ['Vue.js', 'API', 'Composition API']
                    },
                    {
                        name: 'Recipe Finder',
                        description: 'Build a recipe finder application',
                        technologies: ['Vue.js', 'Router', 'Pinia']
                    },
                    {
                        name: 'Task Management',
                        description: 'Develop a task management tool',
                        technologies: ['Vue.js', 'Components', 'State Management']
                    }
                ]
            },
            'fullstack': {
                title: 'Full Stack Mastery',
                level: 'Advanced',
                duration: '24 weeks',
                lessons: 72,
                projects: 8,
                description: 'Become a full stack developer with our comprehensive program covering both frontend and backend.',
                topics: [
                    'Frontend Frameworks (React/Vue)',
                    'Backend Development (Node.js/Express)',
                    'Database Design (SQL/NoSQL)',
                    'RESTful APIs & GraphQL',
                    'Authentication & Security',
                    'Cloud Services & Deployment',
                    'Testing & CI/CD',
                    'DevOps Practices'
                ],
                projects: [
                    {
                        name: 'Social Network',
                        description: 'Build a complete social networking platform',
                        technologies: ['React', 'Node.js', 'MongoDB', 'Redis']
                    },
                    {
                        name: 'E-commerce Platform',
                        description: 'Create a full-featured e-commerce platform',
                        technologies: ['Vue.js', 'Express', 'PostgreSQL', 'Stripe']
                    },
                    {
                        name: 'Learning Management System',
                        description: 'Develop a comprehensive LMS',
                        technologies: ['React', 'Node.js', 'MongoDB', 'AWS']
                    },
                    {
                        name: 'Real-time Analytics Dashboard',
                        description: 'Build a real-time analytics dashboard',
                        technologies: ['Vue.js', 'WebSocket', 'InfluxDB', 'D3.js']
                    },
                    {
                        name: 'Microservices Architecture',
                        description: 'Create a microservices-based application',
                        technologies: ['Docker', 'Kubernetes', 'Node.js', 'MongoDB']
                    },
                    {
                        name: 'Progressive Web App',
                        description: 'Build a PWA with offline capabilities',
                        technologies: ['React', 'Service Workers', 'IndexedDB']
                    },
                    {
                        name: 'API Gateway & Services',
                        description: 'Implement API gateway pattern',
                        technologies: ['Node.js', 'Express', 'Redis', 'PostgreSQL']
                    },
                    {
                        name: 'DevOps Pipeline',
                        description: 'Set up complete CI/CD pipeline',
                        technologies: ['GitHub Actions', 'Docker', 'AWS', 'Terraform']
                    }
                ]
            }
        };

        return courses[courseId] || null;
    }

    // Display course modal
    function displayCourseModal(courseData) {
        const modal = document.getElementById('courseModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');

        modalTitle.textContent = courseData.title;

        const levelColor = {
            'Beginner': 'bg-green-100 text-green-800',
            'Intermediate': 'bg-yellow-100 text-yellow-800',
            'Advanced': 'bg-red-100 text-red-800'
        };

        modalContent.innerHTML = `
            <div class="space-y-6">
                <div class="flex items-center space-x-4">
                    <span class="${levelColor[courseData.level]} px-3 py-1 rounded-full text-sm font-medium">
                        ${courseData.level}
                    </span>
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-clock mr-2"></i>
                        <span>${courseData.duration}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-video mr-2"></i>
                        <span>${courseData.lessons} lessons</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-project-diagram mr-2"></i>
                        <span>${courseData.projects} projects</span>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-2">About this course</h3>
                    <p class="text-gray-600">${courseData.description}</p>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">What you'll learn</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        ${courseData.topics.map(topic => `
                            <div class="flex items-center">
                                <i class="fas fa-check text-green-500 mr-2"></i>
                                <span class="text-gray-700">${topic}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">Mini Projects</h3>
                    <div class="space-y-4">
                        ${courseData.projects.map(project => `
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-gray-800">${project.name}</h4>
                                <p class="text-gray-600 text-sm mb-2">${project.description}</p>
                                <div class="flex flex-wrap gap-2">
                                    ${project.technologies.map(tech => `
                                        <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                            ${tech}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="flex justify-between items-center pt-4 border-t">
                    <div>
                        <span class="text-2xl font-bold text-blue-600">Free</span>
                        <p class="text-sm text-gray-500">Limited time offer</p>
                    </div>
                    <button onclick="enrollInCourseFromModal('${courseData.title}')" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                        Enroll Now
                    </button>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
    }

    // Close course modal
    window.closeCourseModal = function () {
        document.getElementById('courseModal').classList.add('hidden');
    };

    // Enroll from modal
    window.enrollInCourseFromModal = function (courseName) {
        closeCourseModal();

        if (typeof isAuthenticated !== 'undefined' && isAuthenticated()) {
            enrollInCourse(courseName);
        } else {
            showLoginModal();
            showMessage('Please login to enroll in courses', 'info');
        }
    };

    // Add animation to course cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const courseObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.course-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        courseObserver.observe(card);
    });
});

// Course enrollment function (Copied from main.js to ensure availability)
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

// Get total lessons for a course
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

// Add custom styles for courses page
const style = document.createElement('style');
style.textContent = `
    .course-card {
        transition: all 0.3s ease;
    }
    
    .course-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    .filter-btn {
        transition: all 0.3s ease;
    }
    
    .modal-content {
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .modal-content::-webkit-scrollbar {
        width: 6px;
    }
    
    .modal-content::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    
    .modal-content::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;
    }
    
    .modal-content::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;
document.head.appendChild(style);