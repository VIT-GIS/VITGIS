// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCvg1AhjEd9vIiYWgqQlI5BO0jU3AF84t8",
    authDomain: "vitgis-ba14f.firebaseapp.com",
    projectId: "vitgis-ba14f",
    storageBucket: "vitgis-ba14f.storage.app",
    messagingSenderId: "759209581914",
    appId: "1:759209581914:web:3432c0511eba57eca66763"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Get the login form and error message element
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("error-message");

// Define allowed email IDs
const allowedEmails = [
    "raybanpranav.mahesh2023@vitstudent.ac.in",
    "sahildinesh.zambre2023@vitstudent.ac.in"
];

// Handle form submission
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    // Check if the email is allowed
    if (!allowedEmails.includes(email)) {
        errorMessage.textContent = "This email is not authorized.";
        return;
    }

    // Authenticate user with Firebase
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Successful login, redirect to the main page or dashboard
            window.location.href = "../dashboard/index.html"; // Update with your redirect URL
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessageText = error.message;
            // Show error message to user
            errorMessage.textContent = "Login failed: " + errorMessageText;
        });
});
