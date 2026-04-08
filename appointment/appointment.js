const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "smart-branch-fd1d8.firebaseapp.com",
  projectId: "smart-branch-fd1d8",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Load selected service
const service = localStorage.getItem("selectedService");
document.getElementById("service-type").value = service;

// TEMP: get user ID from localStorage (set during login)
const userID = localStorage.getItem("userID");

document.getElementById("btn-book").addEventListener("click", async () => {
  const data = {
    Service_Type: service,
    Branch_Code: document.getElementById("branch-code").value,
    Documents: document.getElementById("documents").value,
    Time_Slot: document.getElementById("time-slot").value,
    Status: "Submitted",
    User_ID: userID,
  };

  try {
    await db.collection("Appointments").add(data);

    alert("Appointment Booked!");
    window.location.href = "../customerUI/index.html";
  } catch (err) {
    alert(err.message);
  }
});
