// Dashboard JavaScript
let progressChart = null;
let userData = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Load dashboard data
    if (isAuthenticated()) {
        loadDashboard();
    }
});

// Load dashboard data
async function loadDashboard() {
    const user = getCurrentUser();
    if (!user) return;

    try {
        // Get user data
        const userDoc = await usersCollection.doc(user.uid).get();
        userData = userDoc.data();

        // Get user progress
        const progressDoc = await progressCollection.doc(user.uid).get();
        const progressData = progressDoc.data() || {};

        // Update UI
        updateStats(userData, progressData);
        loadEnrolledCourses(userData, progressData);
        loadRecentActivity(progressData);
        loadMiniProjects(userData, progressData);
        loadAssignments(userData);
        createProgressChart(progressData);

        // Update welcome message
        document.getElementById('welcome-name').textContent = userData.name || 'Student';
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showMessage('Error loading dashboard data', 'error');
    }
}

// Update statistics
function updateStats(userData, progressData) {
    const enrolledCourses = userData.enrolledCourses || [];
    const completedCourses = userData.completedCourses || [];
    const inProgress = enrolledCourses.filter(course => !completedCourses.includes(course));
    
    // Calculate total hours (estimated)
    const courseHours = {
        'HTML & CSS Fundamentals': 24,
        'JavaScript & DOM': 30,
        'React Development': 36,
        'Node.js & Express': 30,
        'Vue.js Development': 24,
        'Full Stack Mastery': 72
    };
    
    const totalHours = enrolledCourses.reduce((total, course) => {
        return total + (courseHours[course] || 20);
    }, 0);

    // Update DOM
    document.getElementById('courses-enrolled').textContent = enrolledCourses.length;
    document.getElementById('courses-completed').textContent = completedCourses.length;
    document.getElementById('courses-in-progress').textContent = inProgress.length;
    document.getElementById('total-hours').textContent = totalHours;
}

// Load enrolled courses
function loadEnrolledCourses(userData, progressData) {
    const enrolledCourses = userData.enrolledCourses || [];
    const container = document.getElementById('enrolled-courses');
    
    if (enrolledCourses.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-8">
                <i class="fas fa-book-open text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-500">No courses enrolled yet. Browse our <a href="courses.html" class="text-blue-600 hover:underline">courses</a> to get started!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = enrolledCourses.map(course => {
        const progress = progressData[course] || { progressPercentage: 0 };
        const isCompleted = userData.completedCourses.includes(course);
        
        return `
            <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition duration-300" data-aos="fade-up">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-semibold">${course}</h3>
                    ${isCompleted ? 
                        '<span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Completed</span>' : 
                        '<span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">In Progress</span>'
                    }
                </div>
                
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-sm text-gray-600">Progress</span>
                        <span class="text-sm font-medium">${progress.progressPercentage || 0}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: ${progress.progressPercentage || 0}%"></div>
                    </div>
                </div>
                
                <div class="text-sm text-gray-600 mb-4">
                    <div class="flex items-center mb-1">
                        <i class="fas fa-check-circle text-green-500 mr-2"></i>
                        <span>Completed: ${progress.completedLessons ? progress.completedLessons.length : 0} lessons</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-book text-gray-400 mr-2"></i>
                        <span>Total: ${progress.totalLessons || 20} lessons</span>
                    </div>
                </div>
                
                <button onclick="continueCourse('${course}')" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                    ${isCompleted ? 'Review Course' : 'Continue Learning'}
                </button>
            </div>
        `;
    }).join('');
}

// Load recent activity
function loadRecentActivity(progressData) {
    const container = document.getElementById('recent-activity');
    const activities = [];

    // Generate activities from progress data
    Object.entries(progressData).forEach(([course, progress]) => {
        if (progress.completedLessons && progress.completedLessons.length > 0) {
            activities.push({
                type: 'lesson',
                course: course,
                details: `Completed ${progress.completedLessons.length} lessons`,
                date: progress.lastActivity || new Date()
            });
        }
    });

    // Sort by date
    activities.sort((a, b) => b.date - a.date);

    if (activities.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <p class="text-gray-500">No recent activity yet. Start learning to see your progress here!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = activities.slice(0, 5).map(activity => `
        <div class="flex items-center p-3 bg-gray-50 rounded-lg">
            <div class="bg-blue-100 p-2 rounded-full mr-4">
                <i class="fas ${activity.type === 'lesson' ? 'fa-book' : 'fa-trophy'} text-blue-600"></i>
            </div>
            <div class="flex-1">
                <p class="font-medium">${activity.course}</p>
                <p class="text-sm text-gray-600">${activity.details}</p>
            </div>
            <div class="text-sm text-gray-500">
                ${formatDate(activity.date)}
            </div>
        </div>
    `).join('');
}

// Load mini projects
function loadMiniProjects(userData, progressData) {
    const container = document.getElementById('mini-projects');
    const enrolledCourses = userData.enrolledCourses || [];
    
    const projects = getProjectsForCourses(enrolledCourses);
    
    if (projects.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-8">
                <i class="fas fa-project-diagram text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-500">Enroll in courses to see available mini projects!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = projects.map(project => {
        const isCompleted = project.completed || false;
        const progress = project.progress || 0;
        
        return `
            <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition duration-300" data-aos="fade-up">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-semibold">${project.name}</h3>
                    ${isCompleted ? 
                        '<span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Completed</span>' : 
                        '<span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">In Progress</span>'
                    }
                </div>
                
                <p class="text-gray-600 mb-4">${project.description}</p>
                
                <div class="mb-4">
                    <div class="flex flex-wrap gap-2">
                        ${project.technologies.map(tech => `
                            <span class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                ${tech}
                            </span>
                        `).join('')}
                    </div>
                </div>
                
                ${!isCompleted ? `
                    <div class="mb-4">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-sm text-gray-600">Progress</span>
                            <span class="text-sm font-medium">${progress}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-green-600 h-2 rounded-full transition-all duration-300" style="width: ${progress}%"></div>
                        </div>
                    </div>
                ` : ''}
                
                <button onclick="openProjectModal('${project.name}')" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                    ${isCompleted ? 'View Project' : 'Work on Project'}
                </button>
            </div>
        `;
    }).join('');
}

// Load assignments
function loadAssignments(userData) {
    const container = document.getElementById('assignments');
    const enrolledCourses = userData.enrolledCourses || [];
    
    const assignments = getAssignmentsForCourses(enrolledCourses);
    
    if (assignments.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-tasks text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-500">No pending assignments. Great job!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = assignments.map(assignment => `
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition duration-300">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-lg font-semibold">${assignment.title}</h3>
                    <p class="text-sm text-gray-600">${assignment.course}</p>
                </div>
                <div class="text-right">
                    <span class="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                        Due: ${formatDate(assignment.dueDate)}
                    </span>
                </div>
            </div>
            
            <p class="text-gray-600 mb-4">${assignment.description}</p>
            
            <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">
                    <i class="fas fa-file-alt mr-1"></i>
                    ${assignment.type}
                </div>
                <button onclick="openAssignmentModal('${assignment.title}')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                    Submit Assignment
                </button>
            </div>
        </div>
    `).join('');
}

// Create progress chart
function createProgressChart(progressData) {
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    const courses = Object.keys(progressData);
    const progressValues = courses.map(course => progressData[course].progressPercentage || 0);
    
    if (progressChart) {
        progressChart.destroy();
    }
    
    progressChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: courses,
            datasets: [{
                label: 'Progress (%)',
                data: progressValues,
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Get projects for courses
function getProjectsForCourses(courses) {
    const allProjects = [
        {
            name: 'Landing Page',
            description: 'Create a responsive landing page for a fictional company',
            technologies: ['HTML5', 'CSS3', 'Flexbox'],
            course: 'HTML & CSS Fundamentals',
            completed: false,
            progress: 60
        },
        {
            name: 'To-Do App',
            description: 'Build a functional to-do list application',
            technologies: ['JavaScript', 'DOM', 'Local Storage'],
            course: 'JavaScript & DOM',
            completed: false,
            progress: 30
        },
        {
            name: 'Portfolio Website',
            description: 'Build a personal portfolio website to showcase your work',
            technologies: ['HTML5', 'CSS3', 'Grid', 'Animations'],
            course: 'HTML & CSS Fundamentals',
            completed: false,
            progress: 85
        },
        {
            name: 'Weather App',
            description: 'Create a weather application using API data',
            technologies: ['JavaScript', 'API', 'Async/Await'],
            course: 'JavaScript & DOM',
            completed: false,
            progress: 45
        },
        {
            name: 'Task Manager',
            description: 'Create a task management application with React',
            technologies: ['React', 'Hooks', 'State Management'],
            course: 'React Development',
            completed: false,
            progress: 20
        },
        {
            name: 'REST API',
            description: 'Create a RESTful API for a blog platform',
            technologies: ['Node.js', 'Express', 'MongoDB'],
            course: 'Node.js & Express',
            completed: false,
            progress: 10
        }
    ];
    
    return allProjects.filter(project => courses.includes(project.course));
}

// Get assignments for courses
function getAssignmentsForCourses(courses) {
    const allAssignments = [
        {
            title: 'HTML Semantic Structure',
            course: 'HTML & CSS Fundamentals',
            description: 'Create a well-structured HTML document using semantic elements',
            type: 'Code Submission',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        },
        {
            title: 'CSS Grid Layout',
            course: 'HTML & CSS Fundamentals',
            description: 'Build a responsive layout using CSS Grid',
            type: 'Code Submission',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
        },
        {
            title: 'JavaScript Functions',
            course: 'JavaScript & DOM',
            description: 'Create a set of utility functions using modern JavaScript',
            type: 'Code Submission',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
        },
        {
            title: 'DOM Manipulation',
            course: 'JavaScript & DOM',
            description: 'Build an interactive form with dynamic validation',
            type: 'Code Submission',
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
        }
    ];
    
    return allAssignments.filter(assignment => courses.includes(assignment.course));
}

// Continue course
function continueCourse(courseName) {
    // Navigate to course content page (to be implemented)
    showMessage(`Loading ${courseName}...`, 'info');
    
    // For now, just show a message
    setTimeout(() => {
        showMessage('Course content will be available soon!', 'success');
    }, 1000);
}

// Open project modal
function openProjectModal(projectName) {
    const modal = document.getElementById('projectModal');
    const projectTitle = document.getElementById('projectTitle');
    const projectContent = document.getElementById('projectContent');
    
    projectTitle.textContent = projectName;
    
    // Find project details
    const allProjects = getProjectsForCourses(userData ? userData.enrolledCourses || [] : []);
    const project = allProjects.find(p => p.name === projectName);
    
    if (project) {
        projectContent.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-semibold mb-2">Project Description</h3>
                    <p class="text-gray-600">${project.description}</p>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-2">Technologies</h3>
                    <div class="flex flex-wrap gap-2">
                        ${project.technologies.map(tech => `
                            <span class="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                ${tech}
                            </span>
                        `).join('')}
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-2">Requirements</h3>
                    <ul class="space-y-2 text-gray-600">
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                            <span>Follow the project specifications carefully</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                            <span>Write clean, well-documented code</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                            <span>Ensure responsive design for all screen sizes</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                            <span>Test your code thoroughly before submission</span>
                        </li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-2">Resources</h3>
                    <div class="space-y-2">
                        <a href="#" class="block text-blue-600 hover:underline">
                            <i class="fas fa-file-alt mr-2"></i>Project Guidelines
                        </a>
                        <a href="#" class="block text-blue-600 hover:underline">
                            <i class="fas fa-video mr-2"></i>Video Tutorial
                        </a>
                        <a href="#" class="block text-blue-600 hover:underline">
                            <i class="fas fa-code mr-2"></i>Code Examples
                        </a>
                    </div>
                </div>
                
                <div class="flex justify-between items-center pt-4 border-t">
                    <div class="text-sm text-gray-500">
                        <i class="fas fa-clock mr-1"></i>
                        Estimated time: 2-3 hours
                    </div>
                    <button onclick="startProject('${project.name}')" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                        Start Project
                    </button>
                </div>
            </div>
        `;
    }
    
    modal.classList.remove('hidden');
}

// Open assignment modal
function openAssignmentModal(assignmentTitle) {
    const modal = document.getElementById('assignmentModal');
    const assignmentTitleEl = document.getElementById('assignmentTitle');
    const assignmentContent = document.getElementById('assignmentContent');
    
    assignmentTitleEl.textContent = assignmentTitle;
    
    // Find assignment details
    const allAssignments = getAssignmentsForCourses(userData ? userData.enrolledCourses || [] : []);
    const assignment = allAssignments.find(a => a.title === assignmentTitle);
    
    if (assignment) {
        assignmentContent.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-semibold mb-2">Assignment Description</h3>
                    <p class="text-gray-600">${assignment.description}</p>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-2">Instructions</h3>
                    <ol class="space-y-2 text-gray-600 list-decimal list-inside">
                        <li>Read all requirements carefully</li>
                        <li>Write clean, commented code</li>
                        <li>Test your solution thoroughly</li>
                        <li>Submit your work before the deadline</li>
                    </ol>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-2">Submission Details</h3>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="flex items-center mb-2">
                            <i class="fas fa-calendar-alt text-blue-600 mr-2"></i>
                            <span>Due Date: ${formatDate(assignment.dueDate)}</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-file-code text-blue-600 mr-2"></i>
                            <span>Format: Code file (.html, .css, .js)</span>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-2">Submit Your Work</h3>
                    <form onsubmit="submitAssignment(event, '${assignment.title}')" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Project Link (GitHub/CodePen)
                            </label>
                            <input type="url" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="https://github.com/username/project">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Comments
                            </label>
                            <textarea rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Any notes about your submission..."></textarea>
                        </div>
                        
                        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                            Submit Assignment
                        </button>
                    </form>
                </div>
            </div>
        `;
    }
    
    modal.classList.remove('hidden');
}

// Close project modal
function closeProjectModal() {
    document.getElementById('projectModal').classList.add('hidden');
}

// Close assignment modal
function closeAssignmentModal() {
    document.getElementById('assignmentModal').classList.add('hidden');
}

// Start project
function startProject(projectName) {
    closeProjectModal();
    showMessage(`Starting ${projectName}...`, 'info');
    
    // Update project progress
    // This would normally update the database
    setTimeout(() => {
        showMessage('Project workspace opened!', 'success');
        // Redirect to project workspace (to be implemented)
    }, 1000);
}

// Submit assignment
async function submitAssignment(event, assignmentTitle) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const projectLink = formData.get('project-link') || event.target.querySelector('input[type="url"]').value;
    const comments = formData.get('comments') || event.target.querySelector('textarea').value;
    
    try {
        // Create submission record
        const user = getCurrentUser();
        await submissionsCollection.add({
            userId: user.uid,
            userName: userData.name,
            assignmentTitle: assignmentTitle,
            projectLink: projectLink,
            comments: comments,
            submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'submitted'
        });
        
        closeAssignmentModal();
        showMessage('Assignment submitted successfully!', 'success');
        
        // Reload assignments to remove the submitted one
        setTimeout(() => {
            loadAssignments(userData);
        }, 1000);
    } catch (error) {
        console.error('Error submitting assignment:', error);
        showMessage('Error submitting assignment. Please try again.', 'error');
    }
}

// Format date
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = date.toDate();
    }
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Add custom styles
const style = document.createElement('style');
style.textContent = `
    .progress-bar {
        transition: width 0.3s ease;
    }
    
    .stat-card {
        transition: transform 0.3s ease;
    }
    
    .stat-card:hover {
        transform: translateY(-2px);
    }
    
    .course-card {
        transition: all 0.3s ease;
    }
    
    .course-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
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