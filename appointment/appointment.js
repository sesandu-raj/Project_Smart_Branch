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

const btnBook = document.getElementById("btn-book");

if (btnBook) {
  btnBook.addEventListener("click", async () => {
    const branchCode = document.getElementById("branch-code").value;
    const documents = document.getElementById("documents").value;
    const timeSlot = document.getElementById("time-slot").value;

    if (!service) {
      alert("Please choose a service first.");
      return;
    }

    if (!branchCode) {
      alert("Please select a branch.");
      return;
    }

    if (!timeSlot) {
      alert("Please choose an appointment date and time.");
      return;
    }

    const data = {
      Service_Type: service,
      Branch_Code: branchCode,
      Documents: documents,
      Time_Slot: timeSlot,
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
} else {
  console.error("Missing #btn-book button.");
}

async function loadBranches() {
  const branchSelect = document.getElementById("branch-code");

  try {
    const snapshot = await db.collection("Branches").get();

    snapshot.forEach((doc) => {
      const branch = doc.data();

      const option = document.createElement("option");
      option.value = branch.branch_Code;
      option.textContent = `${branch.branch_Name} (${branch.branch_Code})`;

      branchSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading branches:", error);
  }
}
window.addEventListener("DOMContentLoaded", () => {
  loadBranches();
});
