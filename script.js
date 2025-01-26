import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc,setDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDnr-IbqlCfCk2bUdpy7VDnVo9WENCFdvw",
    authDomain: "digital-diary-7c8ba.firebaseapp.com",
    projectId: "digital-diary-7c8ba",
    storageBucket: "digital-diary-7c8ba.firebasestorage.app",
    messagingSenderId: "701539902259",
    appId: "1:701539902259:web:6d5931e2d1cf385dab1446",
    measurementId: "G-1214L7MWLP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    // Set current date in the date section


    // Add event listener to save button


    // Add event listener to sign-up button
    const signupButton = document.querySelector(".signup-btn");
    if (signupButton) {
        signupButton.addEventListener("click", handleSignup);
    } else {
        console.error("Sign-up button with class 'signup-btn' not found in the DOM.");
    }
});

// Sign-up function (unchanged as requested)
async function handleSignup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("Sign-up successful!", user);

        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            email: user.email,
            createdAt: new Date(),
        });

        console.log("User data saved to Firestore!");

        window.location.href = "page2.html";
    } catch (error) {
        console.error("Error during sign-up: ", error.message);
        alert("Sign-up failed! Please check your email or password.");
    }
}

// Save a new diary entry
