import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCvg1AhjEd9vIiYWgqQlI5BO0jU3AF84t8",
    authDomain: "vitgis-ba14f.firebaseapp.com",
    projectId: "vitgis-ba14f",
    storageBucket: "vitgis-ba14f.appspot.com",
    messagingSenderId: "759209581914",
    appId: "1:759209581914:web:3432c0511eba57eca66763"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Allowed email addresses
const allowedEmails = [
    "raybanpranav.mahesh2023@vitstudent.ac.in",
    "sahildinesh2023@vitstudent.ac.in",
    "rohit@vitstudent.ac.in"
];

// Elements
const tableBody = document.querySelector("#location-table tbody");
const popupContainer = document.getElementById("popup-container");
const popupTitle = document.getElementById("popup-title");
const popupAddress = document.getElementById("popup-address");
const closePopupButton = document.getElementById("close-popup");
let map; // Global map variable

// Fetch and Populate Table
async function fetchLocations() {
    const locationsCollection = collection(db, "VITian_location");
    const locationDocs = await getDocs(locationsCollection);

    for (const docSnap of locationDocs.docs) {
        const data = docSnap.data();
        const userId = docSnap.id; // UID as the document ID
        const userName = await fetchUserName(userId); // Fetch user name from VITians collection

        const row = document.createElement("tr");

        // User Name
        const userNameCell = document.createElement("td");
        userNameCell.textContent = userName || "Unknown User";
        row.appendChild(userNameCell);

        // Latitude
        const latCell = document.createElement("td");
        latCell.textContent = data.latitude || "N/A";
        row.appendChild(latCell);

        // Longitude
        const lonCell = document.createElement("td");
        lonCell.textContent = data.longitude || "N/A";
        row.appendChild(lonCell);

        // Action Button
        const actionCell = document.createElement("td");
        const button = document.createElement("button");
        button.textContent = "View Location";
        button.addEventListener("click", async () => {
            const address = await fetchLocationDetails(data.latitude, data.longitude);
            showPopup(data.latitude, data.longitude, userName, address);
        });
        actionCell.appendChild(button);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    }
}

// Fetch User Name from VITians Collection
async function fetchUserName(uid) {
    const userDoc = await getDoc(doc(db, "VITians", uid));
    if (userDoc.exists()) {
        return userDoc.data().name; // Assuming the field is named 'name'
    }
    return null;
}

// Fetch Location Details using OpenCage API
async function fetchLocationDetails(latitude, longitude) {
    if (!latitude || !longitude) return "Invalid coordinates";

    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=f93f2418618544cfa3e20c6b557b605b`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results[0].formatted; // Return formatted address
        }
        return "Location details not found";
    } catch (error) {
        console.error("Error fetching location details:", error);
        return "Error fetching location details";
    }
}

// Show Popup with Location and Map
function showPopup(latitude, longitude, userName, address) {
    popupContainer.style.display = "flex";
    popupTitle.textContent = `${userName}'s Location`;
    popupAddress.innerHTML = `<strong>Address:</strong> ${address}`;

    // Initialize map
    if (map) {
        map.remove(); // Remove existing map instance
    }
    map = L.map("map").setView([latitude, longitude], 15);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add marker
    L.marker([latitude, longitude]).addTo(map).bindPopup(userName).openPopup();
}

// Close Popup
closePopupButton.addEventListener("click", () => {
    popupContainer.style.display = "none";
});

// Check if user is authorized
onAuthStateChanged(auth, (user) => {
    if (user) {
        const email = user.email;
        if (allowedEmails.includes(email)) {
            console.log(`Access granted for ${email}`);
            fetchLocations();
        } else {
            console.error(`Access denied for ${email}`);
            alert("Access Denied: You are not authorized to view this data.");
        }
    } else {
        console.error("No user logged in");
        alert("Please log in to access this data.");
    }
});
