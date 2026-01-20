# Online Bootcamp Platform

A comprehensive online bootcamp platform built with HTML, JavaScript, TailwindCSS, and Firebase authentication. This platform allows students to enroll in web development courses, track their progress, submit assignments, and interact with mini-projects.

## Features

### 🎯 Core Features
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **User Authentication**: Secure login/signup with Firebase
- **Course Management**: Browse and enroll in web development courses
- **Progress Tracking**: Visual progress bars and dashboard analytics
- **Mini Projects**: Hands-on coding projects with real-world applications
- **Assignments**: Submit assignments and receive feedback
- **Social Integration**: Social media links and sharing capabilities

### 📚 Available Courses
1. **HTML & CSS Fundamentals** - 8 weeks, Beginner level
2. **JavaScript & DOM** - 10 weeks, Intermediate level  
3. **React Development** - 12 weeks, Advanced level
4. **Node.js & Express** - 10 weeks, Advanced level
5. **Vue.js Development** - 8 weeks, Intermediate level
6. **Full Stack Mastery** - 24 weeks, Advanced level

### 🎨 Design Features
- **AOS Animations**: Scroll-triggered animations for enhanced UX
- **Modern UI**: Clean, professional design with hover effects
- **Dark Mode Support**: Automatic dark mode based on system preferences
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Smooth Scrolling**: Seamless navigation experience

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: TailwindCSS, Custom CSS
- **Animations**: AOS (Animate On Scroll)
- **Icons**: Font Awesome 6.4.0
- **Authentication**: Firebase Authentication
- **Database**: Firestore
- **Charts**: Chart.js for progress visualization
- **Images**: Unsplash for placeholder images

## Project Structure

```
online-bootcamp-platform/
├── index.html              # Main landing page
├── courses.html             # Course catalog page
├── dashboard.html           # Student dashboard
├── css/
│   └── style.css           # Custom CSS styles
├── js/
│   ├── firebase-config.js  # Firebase configuration
│   ├── auth.js             # Authentication logic
│   ├── main.js             # Landing page functionality
│   ├── courses.js          # Course page functionality
│   └── dashboard.js        # Dashboard functionality
├── images/                 # Image assets
└── pages/                  # Additional pages (if needed)
```

## Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase account (for authentication and database)

### Local Setup
1. Clone or download the project files
2. Open `index.html` in your web browser
3. The platform is ready to use!

### Firebase Setup (Optional)
To enable authentication and database features:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password method)
3. Create a Firestore database
4. Update the Firebase configuration in `js/firebase-config.js`:
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
   };
   ```

## Features Overview

### Landing Page (`index.html`)
- Hero section with compelling call-to-action
- Course showcase with enrollment buttons
- Student testimonials
- Contact form with instructor information
- Social media integration
- Responsive navigation with mobile menu

### Courses Page (`courses.html`)
- Filter courses by difficulty level
- Detailed course information
- Project outlines for each course
- Technology stack displays
- Enrollment functionality
- Course duration and lesson counts

### Dashboard (`dashboard.html`)
- Personalized welcome message
- Progress statistics and charts
- Enrolled courses with progress tracking
- Recent activity feed
- Mini project management
- Assignment submissions
- Interactive progress visualization

### Authentication System
- Secure user registration and login
- Password strength validation
- Session management
- User profile data storage
- Automatic redirects based on auth status

## Key Components

### Mini Projects
- **Landing Page**: Responsive company landing page
- **To-Do App**: JavaScript task manager
- **Weather App**: API integration project
- **Portfolio Website**: Personal portfolio showcase
- **REST API**: Backend development project
- **E-commerce Platform**: Full-stack application

### Assignment System
- Deadline tracking
- File submission capabilities
- Comments and feedback
- Status management
- Progress monitoring

### Progress Tracking
- Visual progress bars
- Course completion percentages
- Lesson completion tracking
- Time investment analytics
- Achievement badges

## Responsive Design

The platform is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)  
- Mobile (320px - 767px)

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security Features

- Firebase authentication security
- Input validation and sanitization
- HTTPS recommended for production
- XSS protection
- Secure data storage

## Performance Optimizations

- Lazy loading for images
- Optimized animations
- Efficient DOM manipulation
- Minimal external dependencies
- Caching strategies

## Future Enhancements

- Video lesson integration
- Live chat with instructors
- Certificate generation
- Payment processing
- Advanced analytics
- Mobile app version
- API integration for third-party services

## Contributing

This is a demonstration project. For production use, consider:
- Environment configuration management
- Advanced error handling
- Comprehensive testing suite
- CI/CD pipeline setup
- Security audit

## Author

**Sekouti Abdelaziz**
- Email: sekoutiabdelaziz0@gmail.com
- Mobile: +212 612-236660

## License

This project is for educational purposes. Feel free to use and modify for learning.

---

### Getting Started

1. Open `index.html` to explore the landing page
2. Click "Sign Up" to create an account (requires Firebase setup)
3. Browse courses on the courses page
4. Enroll in courses and track progress on your dashboard
5. Work on mini projects and submit assignments

Enjoy learning web development with our comprehensive bootcamp platform!# online-bootcamp-platform
