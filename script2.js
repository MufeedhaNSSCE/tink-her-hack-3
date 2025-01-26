import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    serverTimestamp, 
    doc, 
    updateDoc, 
    deleteDoc, 
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Function to fetch and display all diary entries on page load
async function loadEntries() {
    const savedEntriesContainer = document.getElementById("saved-entries");
    savedEntriesContainer.innerHTML = ""; // Clear the container

    try {
        const q = query(collection(db, "diaryEntries"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const entryData = doc.data();
            const entryDiv = createEntryDiv(entryData.content, doc.id);
            savedEntriesContainer.appendChild(entryDiv);
        });
    } catch (error) {
        console.error("Error fetching entries: ", error);
        alert("Failed to load diary entries.");
    }
}

// Function to save a diary entry
async function saveEntry() {
    const content = document.getElementById("content-area").value.trim();
    if (content === "") {
        alert("Please write something in the diary.");
        return;
    }

    const savedEntriesContainer = document.getElementById("saved-entries");

    try {
        const docRef = await addDoc(collection(db, "diaryEntries"), {
            content: content,
            timestamp: serverTimestamp(),
        });

        alert("Diary entry saved successfully!");
        const entryDiv = createEntryDiv(content, docRef.id);
        savedEntriesContainer.prepend(entryDiv); // Add the new entry to the top
        document.getElementById("content-area").value = "";
    } catch (error) {
        console.error("Error saving entry: ", error);
        alert("Failed to save the diary entry.");
    }
}

// Function to create a new diary entry div in the UI
function createEntryDiv(content, docId) {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("saved-entry");
    entryDiv.setAttribute("data-id", docId);

    const contentDiv = document.createElement("div");
    contentDiv.textContent = content;
    entryDiv.appendChild(contentDiv);

    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("buttons");

    const copyBtn = document.createElement("button");
    copyBtn.classList.add("btn");
    copyBtn.textContent = "Copy";
    copyBtn.onclick = () => copyEntry(content);
    buttonDiv.appendChild(copyBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("btn");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editEntry(entryDiv, content);
    buttonDiv.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteEntry(entryDiv, docId);
    buttonDiv.appendChild(deleteBtn);

    entryDiv.appendChild(buttonDiv);
    return entryDiv;
}

// Function to edit an existing diary entry
async function editEntry(entryDiv, oldContent) {
    const newContent = prompt("Edit your entry:", oldContent);
    if (newContent !== null && newContent.trim() !== "") {
        const docId = entryDiv.getAttribute("data-id");

        try {
            const docRef = doc(db, "diaryEntries", docId);
            await updateDoc(docRef, { content: newContent });
            entryDiv.querySelector("div").textContent = newContent;
            alert("Entry updated successfully!");
        } catch (error) {
            console.error("Error updating entry: ", error);
            alert("Failed to update the diary entry.");
        }
    }
}

// Function to delete a diary entry
async function deleteEntry(entryDiv, docId) {
    try {
        const docRef = doc(db, "diaryEntries", docId);
        await deleteDoc(docRef);
        entryDiv.remove();
        alert("Diary entry deleted successfully!");
    } catch (error) {
        console.error("Error deleting entry: ", error);
        alert("Failed to delete the diary entry.");
    }
}

// Function to copy the entry content to the clipboard
function copyEntry(content) {
    navigator.clipboard.writeText(content).then(() => {
        alert("Entry copied to clipboard!");
    }).catch((error) => {
        console.error("Error copying content: ", error);
    });
}

// Set the current date in the date section
document.getElementById("current-date").textContent = new Date().toLocaleDateString();

// Add event listener for the Save button
document.querySelector(".save-btn").addEventListener("click", saveEntry);

// Load all diary entries on page load
window.onload = loadEntries;
