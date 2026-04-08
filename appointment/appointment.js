// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQSGl_cGg_RBqIbIep_cWZMXD_yh8uDSo",
  authDomain: "smart-branch-fd1d8.firebaseapp.com",
  projectId: "smart-branch-fd1d8",
  storageBucket: "smart-branch-fd1d8.firebasestorage.app",
  messagingSenderId: "958934015523",
  appId: "1:958934015523:web:2b0e69e0a65738bb809b96",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 2. Load Selected Service from LocalStorage
const selectedService = localStorage.getItem("selectedService");
if (selectedService) {
  document.getElementById("display-service").innerText = selectedService;
} else {
  document.getElementById("display-service").innerText = "No service selected";
}

// 3. Populate Branches from Firestore
async function loadBranches() {
  const branchSelect = document.getElementById("branch-select");
  try {
    const snapshot = await db.collection("Branches").get();
    snapshot.forEach((doc) => {
      const branch = doc.data();
      const option = document.createElement("option");
      option.value = branch.branch_Code; // Saves "163"
      option.textContent = branch.branch_Name; // Shows "Mayfair, London"
      branchSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading branches:", error);
  }
}

// 4. Handle Appointment Booking
document.getElementById("btn-book").addEventListener("click", async () => {
  const userId = localStorage.getItem("userID");
  const branchCode = document.getElementById("branch-select").value;
  const timeSlot = document.getElementById("time-slot").value;

  // Map checkboxes to a single string (e.g., "National ID, Birth Certificate")
  const checkboxes = document.querySelectorAll(".doc-checkbox:checked");
  const documentList = Array.from(checkboxes)
    .map((cb) => cb.value)
    .join(", ");

  // Validations
  if (!selectedService)
    return alert("Please select a service from the home page.");
  if (!branchCode) return alert("Please select a branch.");
  if (!documentList) return alert("Please check at least one document.");
  if (!timeSlot) return alert("Please pick a time.");

  const appointmentData = {
    Branch_Code: branchCode, // e.g. "163"
    Documents: documentList, // e.g. "National ID, Birth Certificate"
    Service_Type: selectedService, // e.g. "Savings"
    Status: "Submitted", // Default status
    Time_Slot: timeSlot, // e.g. "2026-04-08T00:02"
    User_ID: userId, // e.g. "U4681"
  };

  try {
    await db.collection("Appointments").add(appointmentData);
    alert("Success! Your private session is scheduled.");
    window.location.href = "../customerUI/profile.html"; // Go to profile to see the new appointment
  } catch (error) {
    console.error("Booking Error:", error);
    alert("Error: " + error.message);
  }
});

// Run branch loader on page load
window.onload = loadBranches;
