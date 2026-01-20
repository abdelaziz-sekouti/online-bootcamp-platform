// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDummyKeyForTestingReplaceWithYourKey",
    authDomain: "online-bootcamp-platform.firebaseapp.com",
    projectId: "online-bootcamp-platform",
    storageBucket: "online-bootcamp-platform.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456789012345678"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code == 'unimplemented') {
            console.log('The current browser does not support all of the features required to enable persistence.');
        }
    });

// Collections
const usersCollection = db.collection('users');
const coursesCollection = db.collection('courses');
const progressCollection = db.collection('progress');
const assignmentsCollection = db.collection('assignments');
const submissionsCollection = db.collection('submissions');

console.log('Firebase initialized successfully');